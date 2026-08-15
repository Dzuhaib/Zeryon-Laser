import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getProducts, sanityWrite } from "@/lib/sanity";
import { calculateVat } from "@/lib/vat";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.customer?.email || !body.items?.length)
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    const catalogue = await getProducts();
    const items = body.items.map(
      (item: { productId: string; quantity: number }) => {
        const product = catalogue.find((entry) => entry._id === item.productId);
        if (!product?.price) throw new Error("Unknown product");
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
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
    const order = {
      _type: "order",
      orderNumber,
      status: "new",
      createdAt: new Date().toISOString(),
      customer: body.customer,
      items,
      subtotal,
      vat,
      total,
    };
    if (sanityWrite) await sanityWrite.create(order);
    const key = process.env.RESEND_API_KEY;
    if (key) {
      const resend = new Resend(key);
      const from =
        process.env.RESEND_FROM_EMAIL || "ZERYON <onboarding@resend.dev>";
      const rows = items
        .map((i: any) => `${i.quantity} × ${i.name}`)
        .join("<br/>");
      await Promise.all([
        resend.emails.send({
          from,
          to: body.customer.email,
          subject: `We’ve received your ZERYON order ${orderNumber}`,
          html: `<div style="font-family:Arial;background:#0a0a0a;color:#f1f0ed;padding:40px"><p style="color:#c8b08a;letter-spacing:2px">ZERYON ADVANCED AESTHETIC TECHNOLOGY</p><h1>Order received.</h1><p>Thank you, ${body.customer.firstName}. Your reference is <b>${orderNumber}</b>.</p><p>${rows}</p><p>Subtotal: £${subtotal.toFixed(2)}<br/>VAT (20%): £${vat.toFixed(2)}<br/><b>Total: £${total.toFixed(2)}</b></p><p>We’ll contact you to confirm configuration, training and fulfilment.</p></div>`,
        }),
        process.env.ADMIN_NOTIFICATION_EMAIL
          ? resend.emails.send({
              from,
              to: process.env.ADMIN_NOTIFICATION_EMAIL,
              subject: `New ZERYON order ${orderNumber}`,
              html: `<h1>New order received</h1><p>${body.customer.firstName} ${body.customer.lastName} · ${body.customer.email}</p><p>${rows}</p><p>Subtotal: £${subtotal.toFixed(2)}<br/>VAT (20%): £${vat.toFixed(2)}<br/><b>Total: £${total.toFixed(2)}</b></p>`,
            })
          : Promise.resolve(),
      ]);
    }
    return NextResponse.json({ ok: true, orderNumber });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not create order" },
      { status: 500 },
    );
  }
}
