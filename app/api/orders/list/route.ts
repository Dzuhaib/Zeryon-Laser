import { NextResponse } from "next/server";
import { sanityWrite } from "@/lib/sanity";
import { requireAdmin } from "@/lib/admin";
export async function GET(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  if (!sanityWrite) return NextResponse.json([]);
  const orders = await sanityWrite.fetch(
    `*[_type == "order"]|order(createdAt desc)`,
  );
  return NextResponse.json(orders);
}
