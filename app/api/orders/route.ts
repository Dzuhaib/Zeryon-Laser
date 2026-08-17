import { NextResponse } from "next/server";
import { getProducts, sanityWrite } from "@/lib/sanity";
import { calculateVat } from "@/lib/vat";
import { getSiteUrl, getStripe } from "@/lib/stripe";
import {
  cleanText,
  getClientFingerprint,
  requireAuthenticatedUser,
} from "@/lib/request-security";

export async function POST(request: Request) {
  try {
    const identity = await requireAuthenticatedUser(request);
    const body = await request.json();
    if (
      !Array.isArray(body.items) ||
      !body.items.length ||
      body.items.length > 20
    )
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    if (!sanityWrite)
      return NextResponse.json(
        { error: "Order service unavailable" },
        { status: 503 },
      );
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const clientFingerprint = getClientFingerprint(request);
    const recentOrders = await sanityWrite.fetch<number>(
      `count(*[_type == "order" && createdAt >= $since && (userId == $userId || clientFingerprint == $clientFingerprint)])`,
      { userId: identity.userId, clientFingerprint, since },
    );
    if (recentOrders >= 5)
      return NextResponse.json(
        { error: "Too many checkout attempts. Please try again later." },
        { status: 429 },
      );
    const catalogue = await getProducts();
    const items = body.items.map(
      (item: { productId: string; quantity: number }) => {
        const product = catalogue.find((entry) => entry._id === item.productId);
        if (!product?.price) throw new Error("INVALID_INPUT");
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: Math.min(
            10,
            Math.max(1, Math.floor(Number(item.quantity) || 1)),
          ),
        };
      },
    );
    const subtotal =
      Math.round(
        items.reduce(
          (sum: number, item: { price: number; quantity: number }) =>
            sum + item.price * item.quantity,
          0,
        ) * 100,
      ) / 100;
    const vat = calculateVat(subtotal);
    const total = Math.round((subtotal + vat) * 100) / 100;
    const orderNumber = `ZRY-${Date.now().toString().slice(-8)}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    const customer = {
      firstName: cleanText(body.customer?.firstName, 80, true),
      lastName: cleanText(body.customer?.lastName, 80, true),
      email: identity.email,
      phone: cleanText(body.customer?.phone, 40, true),
      business: cleanText(body.customer?.business, 120),
      address: cleanText(body.customer?.address, 200, true),
      city: cleanText(body.customer?.city, 100, true),
      postcode: cleanText(body.customer?.postcode, 20, true),
      notes: cleanText(body.customer?.notes, 1000),
    };
    const order = await sanityWrite.create({
      _type: "order",
      orderNumber,
      status: "pending_payment",
      paymentStatus: "unpaid",
      createdAt: new Date().toISOString(),
      userId: identity.userId,
      clientFingerprint,
      customer,
      items,
      subtotal,
      vat,
      total,
    });
    try {
      const session = await getStripe().checkout.sessions.create({
        mode: "payment",
        customer_email: customer.email,
        billing_address_collection: "required",
        phone_number_collection: { enabled: true },
        line_items: [
          ...items.map(
            (item: { name: string; price: number; quantity: number }) => ({
              quantity: item.quantity,
              price_data: {
                currency: "gbp",
                unit_amount: Math.round(item.price * 100),
                product_data: { name: item.name },
              },
            }),
          ),
          {
            quantity: 1,
            price_data: {
              currency: "gbp",
              unit_amount: Math.round(vat * 100),
              product_data: { name: "VAT (20%)" },
            },
          },
        ],
        metadata: { orderId: order._id, orderNumber, userId: identity.userId },
        payment_intent_data: { metadata: { orderId: order._id, orderNumber } },
        success_url: `${getSiteUrl(request)}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getSiteUrl(request)}/checkout?cancelled=1`,
      });
      await sanityWrite
        .patch(order._id)
        .set({ stripeCheckoutSessionId: session.id })
        .commit();
      return NextResponse.json({ url: session.url });
    } catch (error) {
      await sanityWrite.delete(order._id);
      throw error;
    }
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "";
    const status = [
      "INVALID_ORIGIN",
      "AUTH_REQUIRED",
      "VERIFIED_EMAIL_REQUIRED",
    ].includes(message)
      ? 401
      : message === "INVALID_INPUT"
        ? 400
        : message === "STRIPE_NOT_CONFIGURED"
          ? 503
          : 500;
    return NextResponse.json(
      {
        error:
          status === 503
            ? "Payment service is not configured"
            : status === 500
              ? "Could not start checkout"
              : "Invalid request",
      },
      { status },
    );
  }
}
