import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sanityWrite } from "@/lib/sanity";
import {
  cleanText,
  escapeHtml,
  getClientFingerprint,
  requireSameOrigin,
} from "@/lib/request-security";

const interests = new Set([
  "Machines",
  "Training",
  "Machines + Training",
  "General advice",
]);

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    if (!sanityWrite || !process.env.RESEND_API_KEY)
      return NextResponse.json(
        { error: "Enquiry service is unavailable" },
        { status: 503 },
      );
    const body = await request.json();
    if (body.website) return NextResponse.json({ ok: true });

    const fingerprint = getClientFingerprint(request);
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recent = await sanityWrite.fetch<number>(
      `count(*[_type == "contactEvent" && clientFingerprint == $fingerprint && createdAt >= $since])`,
      { fingerprint, since },
    );
    if (recent >= 5)
      return NextResponse.json(
        { error: "Too many enquiries. Please try again later." },
        { status: 429 },
      );

    const name = cleanText(body.name, 100, true);
    const email = cleanText(body.email, 254, true).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json(
        { error: "Enter a valid email address" },
        { status: 400 },
      );
    const phone = cleanText(body.phone, 40);
    const business = cleanText(body.business, 140);
    const interest = interests.has(body.interest)
      ? body.interest
      : "General advice";
    const message = cleanText(body.message, 3000, true);
    const recipient = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!recipient)
      return NextResponse.json(
        { error: "Enquiry recipient is not configured" },
        { status: 503 },
      );

    await sanityWrite.create({
      _type: "contactEvent",
      createdAt: new Date().toISOString(),
      clientFingerprint: fingerprint,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from =
      process.env.RESEND_FROM_EMAIL || "ZERYON <onboarding@resend.dev>";
    await resend.emails.send({
      from,
      to: recipient,
      replyTo: email,
      subject: `New ZERYON enquiry: ${interest}`,
      html: `<div style="font-family:Arial,sans-serif"><h1>New website enquiry</h1><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p><p><strong>Business:</strong> ${escapeHtml(business || "Not provided")}</p><p><strong>Interested in:</strong> ${escapeHtml(interest)}</p><p><strong>Message:</strong></p><p style="white-space:pre-wrap">${escapeHtml(message)}</p></div>`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const status =
      message === "INVALID_INPUT"
        ? 400
        : message === "INVALID_ORIGIN"
          ? 403
          : 500;
    return NextResponse.json(
      {
        error:
          status === 500 ? "Could not send your enquiry" : "Invalid enquiry",
      },
      { status },
    );
  }
}
