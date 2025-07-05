import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Deleting invoice with ID:", params.id);

    // Delete invoice items first (due to foreign key constraint)
    const deletedItems = await prisma.invoiceItem.deleteMany({
      where: { invoiceId: params.id },
    });
    console.log("Deleted items:", deletedItems);

    // Delete the invoice
    const deletedInvoice = await prisma.invoice.delete({
      where: { id: params.id },
      include: {
        client: true,
        items: true,
      },
    });
    console.log("Deleted invoice:", deletedInvoice);

    // Delete the client if no other invoices reference it
    const remainingInvoices = await prisma.invoice.count({
      where: { clientId: deletedInvoice.clientId },
    });

    if (remainingInvoices === 0) {
      const deletedClient = await prisma.clientInfo.delete({
        where: { id: deletedInvoice.clientId },
      });
      console.log("Deleted client:", deletedClient);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error deleting invoice:", e);
    return NextResponse.json(
      {
        success: false,
        error: "Invoice not found or failed to delete",
        details: e instanceof Error ? e.message : String(e),
      },
      { status: 404 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    // Update client info
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { client: true },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Update client information
    await prisma.clientInfo.update({
      where: { id: invoice.clientId },
      data: {
        name: data.client.name,
        email: data.client.email,
        dueDate: new Date(data.client.dueDate),
      },
    });

    // Update invoice status and total
    await prisma.invoice.update({
      where: { id: params.id },
      data: {
        status: data.status,
        total: data.total,
      },
    });

    // Delete existing items and create new ones
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: params.id },
    });

    if (data.items && data.items.length > 0) {
      await Promise.all(
        data.items.map(
          (item: { name: string; quantity: number; price: number }) =>
            prisma.invoiceItem.create({
              data: {
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                invoiceId: params.id,
              },
            })
        )
      );
    }

    // Fetch updated invoice
    const updatedInvoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json({ success: true, invoice: updatedInvoice });
  } catch (e) {
    console.error("Error updating invoice:", e);
    return NextResponse.json(
      { success: false, error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}
