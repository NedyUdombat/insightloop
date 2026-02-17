import AuditService from "@/api/services/AuditService";
import AuthService from "@/api/services/AuthService";
import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";

export const POST = requireAuth(async (req) => {
  const authService = new AuthService();
  const auditService = new AuditService();

  await authService.destroySession(req.session.id);
  await authService.deleteCookies();

  await auditService.audit({
    action: "LOGOUT",
    userId: req.user.id,
    metadata: null,
  });

  return NextResponse.json({ success: true }, { status: 200 });
});
