import { Resend } from "resend";
import { escapeHtml } from "@/lib/request-security";

type OrderEmail = {
  orderNumber: string;
  customer: { firstName: string; lastName: string; email: string };
  items: Array<{ name: string; quantity: number }>;
  subtotal: number;
  vat: number;
  total: number;
};

export async function sendPaidOrderEmails(order: OrderEmail) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.RESEND_FROM_EMAIL || "ZERYON <onboarding@resend.dev>";
  const rows = order.items
    .map((item) => `${item.quantity} &times; ${escapeHtml(item.name)}`)
    .join("<br/>");
  const totals = `Subtotal: &pound;${order.subtotal.toFixed(2)}<br/>VAT (20%): &pound;${order.vat.toFixed(2)}<br/><b>Total paid: &pound;${order.total.toFixed(2)}</b>`;
  await Promise.all([
    resend.emails.send({
      from,
      to: order.customer.email,
      subject: `Payment confirmed for ZERYON order ${order.orderNumber}`,
      html: `<div style="font-family:Arial;background:#0a0a0a;color:#f1f0ed;padding:40px"><p style="color:#c8b08a;letter-spacing:2px">ZERYON ADVANCED AESTHETIC TECHNOLOGY</p><h1>Payment confirmed.</h1><p>Thank you, ${escapeHtml(order.customer.firstName)}. Your reference is <b>${escapeHtml(order.orderNumber)}</b>.</p><p>${rows}</p><p>${totals}</p><p>We'll contact you to confirm configuration, training and fulfilment.</p></div>`,
    }),
    process.env.ADMIN_NOTIFICATION_EMAIL
      ? resend.emails.send({
          from,
          to: process.env.ADMIN_NOTIFICATION_EMAIL,
          subject: `Paid ZERYON order ${order.orderNumber}`,
          html: `<h1>New paid order</h1><p>${escapeHtml(order.customer.firstName)} ${escapeHtml(order.customer.lastName)} &middot; ${escapeHtml(order.customer.email)}</p><p>${rows}</p><p>${totals}</p>`,
        })
      : Promise.resolve(),
  ]);
}
