import { NextResponse } from "next/server";
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
    const body = await request.json();
    const updated = await sanityWrite.patch(id).set(body).commit();
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Unable to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    if (!sanityWrite) throw new Error();
    const { id } = await params;
    await sanityWrite.delete(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete product" },
      { status: 500 },
    );
  }
}
