import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// Helper function to check if invoice is overdue
const checkInvoiceStatus = (dueDate: string, currentStatus: string) => {
  const today = new Date();
  const due = new Date(dueDate);

  if (currentStatus === "paid") return "paid";
  if (today > due) return "overdue";
  return "unpaid";
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("Received data:", data);

    // Create client first
    const client = await prisma.clientInfo.create({
      data: {
        name: data.client.name,
        email: data.client.email,
        dueDate: new Date(data.client.dueDate),
      },
    });
    console.log("Client created:", client);

    // Generate custom invoice number
    const timestamp = Date.now();
    const cleanClientName = data.client.name
      .toUpperCase()
      .replace(/\s+/g, " ")
      .trim();
    const invoiceNumber = `INVOICE-${cleanClientName}-${timestamp}`;

    // Create invoice with client relation
    const newInvoice = await prisma.invoice.create({
      data: {
        id: invoiceNumber, // Use custom invoice number as ID
        status: data.status,
        total: data.total,
        clientId: client.id,
      },
      include: {
        client: true,
        items: true,
      },
    });
    console.log("Invoice created:", newInvoice);

    // Create invoice items
    if (data.items && data.items.length > 0) {
      const items = await Promise.all(
        data.items.map(
          (item: { name: string; quantity: number; price: number }) =>
            prisma.invoiceItem.create({
              data: {
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                invoiceId: newInvoice.id,
              },
            })
        )
      );
      console.log("Items created:", items);
    }

    // Fetch the complete invoice with items
    const completeInvoice = await prisma.invoice.findUnique({
      where: { id: newInvoice.id },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(
      { success: true, invoice: completeInvoice },
      { status: 201 }
    );
  } catch (e) {
    console.error("Error creating invoice:", e);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create invoice",
        details: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Update status based on due date
    const updatedInvoices = await Promise.all(
      invoices.map(async (invoice) => {
        const newStatus = checkInvoiceStatus(
          invoice.client.dueDate.toISOString().split("T")[0],
          invoice.status
        );

        // Update status in database if it changed
        if (newStatus !== invoice.status) {
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: newStatus },
          });
        }

        return {
          ...invoice,
          status: newStatus,
        };
      })
    );

    return NextResponse.json({
      success: true,
      invoices: updatedInvoices,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
