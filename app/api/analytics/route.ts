import { NextResponse } from "next/server";
import { getProducts, sanityWrite } from "@/lib/sanity";
import {
  getClientFingerprint,
  requireAuthenticatedUser,
} from "@/lib/request-security";

export async function POST(request: Request) {
  try {
    if (!sanityWrite)
      return NextResponse.json(
        { error: "Analytics unavailable" },
        { status: 503 },
      );
    const identity = await requireAuthenticatedUser(request);
    const body = await request.json();
    if (
      !["product_view", "cart_add"].includes(body.event) ||
      typeof body.productId !== "string"
    )
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });

    const product = (await getProducts()).find(
      (item) => item._id === body.productId,
    );
    if (!product)
      return NextResponse.json({ error: "Unknown product" }, { status: 400 });
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const clientFingerprint = getClientFingerprint(request);
    const recentEvents = await sanityWrite.fetch<number>(
      `count(*[_type == "storeEvent" && createdAt >= $since && (userId == $userId || clientFingerprint == $clientFingerprint)])`,
      { userId: identity.userId, clientFingerprint, since },
    );
    if (recentEvents >= 100)
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );

    await sanityWrite.create({
      _type: "storeEvent",
      event: body.event,
      createdAt: new Date().toISOString(),
      productId: product._id,
      productName: product.name,
      userId: identity.userId,
      clientFingerprint,
      customerEmail: identity.email,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
