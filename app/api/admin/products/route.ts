import { NextResponse } from "next/server";
import { getProducts, sanityWrite } from "@/lib/sanity";
import { requireAdmin } from "@/lib/admin";
import { requireSameOrigin } from "@/lib/request-security";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await getProducts());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    await requireAdmin();
    if (!sanityWrite)
      return NextResponse.json(
        { error: "Sanity write client is not configured" },
        { status: 503 },
      );
    const body = await request.json();
    if (!body.name || !body.slug || !body.price)
      return NextResponse.json(
        { error: "Name, slug and price are required" },
        { status: 400 },
      );
    const imageMatch = body.imageData
      ? String(body.imageData).match(/^data:(.*?);base64,(.*)$/)
      : null;
    if (
      body.imageData &&
      (!imageMatch ||
        !["image/jpeg", "image/png", "image/webp"].includes(imageMatch[1]) ||
        imageMatch[2].length > 8_000_000)
    )
      return NextResponse.json(
        { error: "Image must be JPEG, PNG or WebP and under 6 MB" },
        { status: 400 },
      );
    const product = await sanityWrite.create({
      _type: "product",
      name: body.name,
      slug: { _type: "slug", current: body.slug },
      category: body.category || "Machine + Training",
      price: Number(body.price),
      summary: body.summary || "",
      description: body.description || "",
      applications: body.applications || [],
      features: body.features || [],
      included: body.included || [],
      specifications: (body.specifications || []).map(
        (item: { label: string; value: string }, index: number) => ({
          _type: "specification",
          _key: `spec-${Date.now()}-${index}`,
          ...item,
        }),
      ),
      featured: body.featured !== false,
      order: Number(body.order || 99),
    });
    if (imageMatch) {
      const asset = await sanityWrite.assets.upload(
        "image",
        Buffer.from(imageMatch[2], "base64"),
        {
          filename: body.imageName || "product-image",
          contentType: imageMatch[1],
        },
      );
      await sanityWrite
        .patch(product._id)
        .set({
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
          },
        })
        .commit();
    }
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create product" },
      { status: 500 },
    );
  }
}
