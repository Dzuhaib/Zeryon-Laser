import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sanityWrite } from "@/lib/sanity";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    if (!sanityWrite) throw new Error();
    const { id } = await params;
    const { status } = await request.json();
    const order: any = await sanityWrite.fetch(
      `*[_type == "order" && _id == $id][0]`,
      { id },
    );
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const updated = await sanityWrite.patch(id).set({ status }).commit();
    if (process.env.RESEND_API_KEY && order.customer?.email) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "ZERYON <onboarding@resend.dev>",
        to: order.customer.email,
        subject: `Your ZERYON order ${order.orderNumber} is ${status}`,
        html: `<p>Your ZERYON order <strong>${order.orderNumber}</strong> is now <strong>${status}</strong>.</p><p>We will contact you with the next steps.</p>`,
      });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Unable to update order" },
      { status: 500 },
    );
  }
}
