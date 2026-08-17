import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { sanityWrite } from "@/lib/sanity";
import { sendPaidOrderEmails } from "@/lib/order-email";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sanityWrite || !process.env.STRIPE_WEBHOOK_SECRET)
    return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 });
  let event: Stripe.Event;
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) throw new Error("Missing Stripe signature");
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Invalid Stripe webhook", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  if (!orderId) return NextResponse.json({ received: true });
  if (
    (event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded") &&
    session.payment_status === "paid"
  ) {
    const order = await sanityWrite.fetch<any>(
      `*[_type == "order" && _id == $orderId][0]`,
      { orderId },
    );
    if (order && order.paymentStatus !== "paid") {
      if (
        session.currency !== "gbp" ||
        session.amount_total !== Math.round(Number(order.total) * 100)
      )
        return NextResponse.json(
          { error: "Payment total mismatch" },
          { status: 400 },
        );
      await sanityWrite
        .patch(orderId)
        .ifRevisionId(order._rev)
        .set({
          status: "new",
          paymentStatus: "paid",
          paidAt: new Date().toISOString(),
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: String(session.payment_intent || ""),
        })
        .commit();
      try {
        await sendPaidOrderEmails(order);
      } catch (error) {
        console.error("Paid order email failed", error);
      }
    }
  }
  if (event.type === "checkout.session.expired")
    await sanityWrite
      .patch(orderId)
      .set({ status: "cancelled", paymentStatus: "expired" })
      .commit();
  return NextResponse.json({ received: true });
}
