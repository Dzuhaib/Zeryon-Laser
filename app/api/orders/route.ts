import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getProducts, sanityWrite } from "@/lib/sanity";
import { calculateVat } from "@/lib/vat";
import {
  cleanText,
  escapeHtml,
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
    const recentOrders = await sanityWrite.fetch<number>(
      `count(*[_type == "order" && userId == $userId && createdAt >= $since])`,
      { userId: identity.userId, since },
    );
    if (recentOrders >= 5)
      return NextResponse.json(
        { error: "Too many order attempts. Please try again later." },
        { status: 429 },
      );

    const catalogue = await getProducts();
    const items = body.items.map(
      (item: { productId: string; quantity: number }) => {
        const product = catalogue.find((entry) => entry._id === item.productId);
        if (!product?.price) throw new Error("Unknown product");
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
    const orderNumber = `ZRY-${Date.now().toString().slice(-8)}`;
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
    await sanityWrite.create({
      _type: "order",
      orderNumber,
      status: "new",
      createdAt: new Date().toISOString(),
      userId: identity.userId,
      customer,
      items,
      subtotal,
      vat,
      total,
    });

    const key = process.env.RESEND_API_KEY;
    if (key) {
      const resend = new Resend(key);
      const from =
        process.env.RESEND_FROM_EMAIL || "ZERYON <onboarding@resend.dev>";
      const rows = items
        .map(
          (item: { quantity: number; name: string }) =>
            `${item.quantity} × ${escapeHtml(item.name)}`,
        )
        .join("<br/>");
      await Promise.all([
        resend.emails.send({
          from,
          to: customer.email,
          subject: `We've received your ZERYON order ${orderNumber}`,
          html: `<div style="font-family:Arial;background:#0a0a0a;color:#f1f0ed;padding:40px"><p style="color:#c8b08a;letter-spacing:2px">ZERYON ADVANCED AESTHETIC TECHNOLOGY</p><h1>Order received.</h1><p>Thank you, ${escapeHtml(customer.firstName)}. Your reference is <b>${escapeHtml(orderNumber)}</b>.</p><p>${rows}</p><p>Subtotal: £${subtotal.toFixed(2)}<br/>VAT (20%): £${vat.toFixed(2)}<br/><b>Total: £${total.toFixed(2)}</b></p><p>We'll contact you to confirm configuration, training and fulfilment.</p></div>`,
        }),
        process.env.ADMIN_NOTIFICATION_EMAIL
          ? resend.emails.send({
              from,
              to: process.env.ADMIN_NOTIFICATION_EMAIL,
              subject: `New ZERYON order ${orderNumber}`,
              html: `<h1>New order received</h1><p>${escapeHtml(customer.firstName)} ${escapeHtml(customer.lastName)} · ${escapeHtml(customer.email)}</p><p>${rows}</p><p>Subtotal: £${subtotal.toFixed(2)}<br/>VAT (20%): £${vat.toFixed(2)}<br/><b>Total: £${total.toFixed(2)}</b></p>`,
            })
          : Promise.resolve(),
      ]);
    }
    return NextResponse.json({ ok: true, orderNumber });
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
        : 500;
    return NextResponse.json(
      { error: status === 500 ? "Could not create order" : "Invalid request" },
      { status },
    );
  }
}
