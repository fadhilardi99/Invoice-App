import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { Invoice, InvoiceItem } from "@/types/invoice";

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, invoiceId, invoiceData } = await req.json();

    // Validate required fields
    if (!to || !subject || !invoiceId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: to, subject, invoiceId",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.warn("SendGrid API key not configured, using simulation mode");

      // Simulate email sending for development
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return NextResponse.json({
        success: true,
        message: "Email sent successfully (simulation mode)",
        emailId: `sim_${Date.now()}`,
        timestamp: new Date().toISOString(),
        mode: "simulation",
      });
    }

    // Create email HTML content
    const emailHtml = createInvoiceEmailHTML(invoiceData);

    // SendGrid email configuration
    const msg = {
      to: to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || "noreply@yourdomain.com",
        name: process.env.SENDGRID_FROM_NAME || "PT. Elektronik Indonesia",
      },
      subject: subject,
      html: emailHtml,
      text: createInvoiceEmailText(invoiceData), // Plain text fallback
    };

    // Send email via SendGrid
    const response = await sgMail.send(msg);

    console.log("Email sent successfully:", {
      to,
      subject,
      invoiceId,
      messageId: response[0]?.headers["x-message-id"],
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      emailId: response[0]?.headers["x-message-id"] || `email_${Date.now()}`,
      timestamp: new Date().toISOString(),
      mode: "sendgrid",
    });
  } catch (error) {
    console.error("Email sending error:", error);

    // Handle SendGrid specific errors
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          {
            success: false,
            error: "SendGrid API key is invalid or not configured",
            details: "Please check your SENDGRID_API_KEY environment variable",
          },
          { status: 401 }
        );
      }

      if (error.message.includes("Forbidden")) {
        return NextResponse.json(
          {
            success: false,
            error: "SendGrid account not authorized to send emails",
            details:
              "Please verify your SendGrid account and sender verification",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Helper function to create HTML email content
function createInvoiceEmailHTML(invoiceData: Invoice | null): string {
  if (!invoiceData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Invoice</h2>
        <p>Please find your invoice attached.</p>
        <p>Thank you for your business!</p>
      </div>
    `;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">PT. Elektronik Indonesia</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Professional Electronic Solutions</p>
      </div>
      
      <div style="padding: 30px; background: white; border: 1px solid #e5e7eb;">
        <h2 style="color: #3b82f6; margin-bottom: 20px;">Invoice ${
          invoiceData.id
        }</h2>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; margin-bottom: 10px;">Bill To:</h3>
          <p style="margin: 5px 0; font-weight: bold;">${
            invoiceData.client?.name || "N/A"
          }</p>
          <p style="margin: 5px 0; color: #6b7280;">${
            invoiceData.client?.email || "N/A"
          }</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; margin-bottom: 15px;">Invoice Details:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background: #f3f4f6;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #d1d5db;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #d1d5db;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #d1d5db;">Price</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #d1d5db;">Total</th>
            </tr>
            ${
              invoiceData.items
                ?.map(
                  (item: InvoiceItem) => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${
                  item.name
                }</td>
                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">${
                  item.quantity
                }</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">Rp ${item.price?.toLocaleString(
                  "id-ID"
                )}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Rp ${(
                  item.quantity * item.price
                )?.toLocaleString("id-ID")}</td>
              </tr>
            `
                )
                .join("") || ""
            }
          </table>
          
          <div style="text-align: right; background: #eff6ff; padding: 20px; border-radius: 8px;">
            <p style="margin: 5px 0; font-size: 16px;">Total: <strong style="color: #3b82f6; font-size: 20px;">Rp ${invoiceData.total?.toLocaleString(
              "id-ID"
            )}</strong></p>
          </div>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h4 style="margin: 0 0 15px 0; color: #374151;">Payment Information:</h4>
          <p style="margin: 5px 0;"><strong>Bank:</strong> BCA</p>
          <p style="margin: 5px 0;"><strong>Account:</strong> 321098756</p>
          <p style="margin: 5px 0;"><strong>Name:</strong> PT. Elektronik Indonesia</p>
          <p style="margin: 5px 0;"><strong>Due Date:</strong> ${
            invoiceData.client?.dueDate
              ? new Date(invoiceData.client.dueDate).toLocaleDateString("id-ID")
              : "N/A"
          }</p>
        </div>
        
        <div style="text-align: center; background: #3b82f6; color: white; padding: 20px; border-radius: 8px;">
          <p style="margin: 0; font-size: 18px;">Thank you for your business!</p>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">For any questions, please contact us at hello@elektronikindo.com</p>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
        <p>This email was sent from PT. Elektronik Indonesia</p>
        <p>Jl. Pakansari 33, Cibinong, Indonesia</p>
      </div>
    </div>
  `;
}

// Helper function to create plain text email content
function createInvoiceEmailText(invoiceData: Invoice | null): string {
  if (!invoiceData) {
    return `
Invoice

Please find your invoice attached.

Thank you for your business!

PT. Elektronik Indonesia
Jl. Pakansari 33, Cibinong, Indonesia
hello@elektronikindo.com
    `;
  }

  return `
INVOICE ${invoiceData.id}

PT. Elektronik Indonesia
Jl. Pakansari 33, Cibinong, Indonesia
hello@elektronikindo.com

Bill To:
${invoiceData.client?.name || "N/A"}
${invoiceData.client?.email || "N/A"}

Invoice Items:
${
  invoiceData.items
    ?.map(
      (item: InvoiceItem) =>
        `${item.name} - Qty: ${
          item.quantity
        } - Price: Rp ${item.price?.toLocaleString("id-ID")} - Total: Rp ${(
          item.quantity * item.price
        )?.toLocaleString("id-ID")}`
    )
    .join("\n") || "No items"
}

Total: Rp ${invoiceData.total?.toLocaleString("id-ID")}

Payment Information:
Bank: BCA
Account: 321098756
Name: PT. Elektronik Indonesia
Due Date: ${
    invoiceData.client?.dueDate
      ? new Date(invoiceData.client.dueDate).toLocaleDateString("id-ID")
      : "N/A"
  }

Thank you for your business!

For any questions, please contact us at hello@elektronikindo.com
  `;
}
