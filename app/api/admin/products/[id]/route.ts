import { NextResponse } from "next/server";
import { sanityWrite } from "@/lib/sanity";
import { requireAdmin } from "@/lib/admin";
import { requireSameOrigin } from "@/lib/request-security";
import { writeAdminAudit } from "@/lib/audit";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    requireSameOrigin(request);
    const adminId = await requireAdmin();
    if (!sanityWrite) throw new Error();
    const { id } = await params;
    const body = await request.json();
    const { imageData, imageName } = body;
    const imageMatch = imageData
      ? String(imageData).match(/^data:(.*?);base64,(.*)$/)
      : null;
    if (
      imageData &&
      (!imageMatch ||
        !["image/jpeg", "image/png", "image/webp"].includes(imageMatch[1]) ||
        imageMatch[2].length > 8_000_000)
    )
      return NextResponse.json(
        { error: "Image must be JPEG, PNG or WebP and under 6 MB" },
        { status: 400 },
      );
    const fields: Record<string, any> = {};
    for (const key of [
      "name",
      "slug",
      "category",
      "price",
      "summary",
      "description",
      "applications",
      "features",
      "included",
      "specifications",
      "featured",
      "order",
    ])
      if (body[key] !== undefined) fields[key] = body[key];
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
    if (imageMatch) {
      const asset = await sanityWrite.assets.upload(
        "image",
        Buffer.from(imageMatch[2], "base64"),
        {
          filename: imageName || "product-image",
          contentType: imageMatch[1],
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
    await writeAdminAudit({
      request,
      adminId,
      action: "product.updated",
      targetId: id,
      details: {
        fields: Object.keys(fields),
        imageUpdated: Boolean(imageMatch),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Unable to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    requireSameOrigin(request);
    const adminId = await requireAdmin();
    if (!sanityWrite) throw new Error();
    const { id } = await params;
    const product = await sanityWrite.fetch<{ name?: string } | null>(
      `*[_type == "product" && _id == $id][0]{name}`,
      { id },
    );
    await sanityWrite.delete(id);
    await writeAdminAudit({
      request,
      adminId,
      action: "product.deleted",
      targetId: id,
      details: { name: product?.name || "Unknown" },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete product" },
      { status: 500 },
    );
  }
}
