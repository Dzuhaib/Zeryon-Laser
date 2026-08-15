import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { sanityWrite } from "@/lib/sanity";

export async function POST(request: Request) {
  try {
    if (!sanityWrite) return NextResponse.json({ ok: false });
    const body = await request.json();
    if (!["product_view", "cart_add"].includes(body.event) || !body.productId)
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    const { userId } = await auth();
    const user = userId ? await currentUser() : null;
    await sanityWrite.create({
      _type: "storeEvent",
      event: body.event,
      createdAt: new Date().toISOString(),
      productId: body.productId,
      productName: body.productName || "",
      userId: userId || null,
      customerEmail: user?.primaryEmailAddress?.emailAddress || null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
