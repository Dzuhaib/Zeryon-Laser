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
    const { imageData, imageName, ...fields } = body;
    if (typeof fields.slug === "string")
      fields.slug = { _type: "slug", current: fields.slug };
    if (Array.isArray(fields.specifications))
      fields.specifications = fields.specifications.map(
        (item: { label: string; value: string }, index: number) => ({
          _type: "specification",
          _key: `spec-${Date.now()}-${index}`,
          ...item,
        }),
      );
    let updated = await sanityWrite.patch(id).set(fields).commit();
    if (imageData) {
      const match = String(imageData).match(/^data:(.*?);base64,(.*)$/);
      if (match) {
        const asset = await sanityWrite.assets.upload(
          "image",
          Buffer.from(match[2], "base64"),
          {
            filename: imageName || "product-image",
            contentType: match[1],
          },
        );
        updated = await sanityWrite
          .patch(id)
          .set({
            image: {
              _type: "image",
              asset: { _type: "reference", _ref: asset._id },
            },
          })
          .commit();
      }
    }
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
