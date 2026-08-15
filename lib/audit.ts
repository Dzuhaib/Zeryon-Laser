import { sanityWrite } from "@/lib/sanity";
import { getClientFingerprint } from "@/lib/request-security";

export async function writeAdminAudit({
  request,
  adminId,
  action,
  targetId,
  details,
}: {
  request: Request;
  adminId: string;
  action: string;
  targetId: string;
  details?: Record<string, unknown>;
}) {
  if (!sanityWrite) return;
  try {
    await sanityWrite.create({
      _type: "adminAuditLog",
      action,
      targetId,
      adminId,
      createdAt: new Date().toISOString(),
      clientFingerprint: getClientFingerprint(request),
      userAgent: request.headers.get("user-agent")?.slice(0, 300) || "unknown",
      details: details || {},
    });
  } catch (error) {
    console.error("Unable to write admin audit log", error);
  }
}
