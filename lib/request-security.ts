import { auth, currentUser } from "@clerk/nextjs/server";

export function requireSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = new URL(request.url).origin;
  if (!origin || origin !== expected) throw new Error("INVALID_ORIGIN");
}

export async function requireAuthenticatedUser(request: Request) {
  requireSameOrigin(request);
  const { userId } = await auth();
  if (!userId) throw new Error("AUTH_REQUIRED");
  const user = await currentUser();
  const primaryEmail = user?.primaryEmailAddress;
  const email =
    primaryEmail?.verification?.status === "verified"
      ? primaryEmail.emailAddress
      : undefined;
  if (!email) throw new Error("VERIFIED_EMAIL_REQUIRED");
  return { userId, email };
}

export function cleanText(value: unknown, maxLength: number, required = false) {
  const text =
    typeof value === "string" ? value.trim().slice(0, maxLength) : "";
  if (required && !text) throw new Error("INVALID_INPUT");
  return text;
}

export function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
