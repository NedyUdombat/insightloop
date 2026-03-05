import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import AuditService from "@/api/services/AuditService";
import AuthService from "@/api/services/AuthService";

export const POST = requireAuth(async (req) => {
  const authService = new AuthService();
  const auditService = new AuditService();

  await authService.destroyAllSessions(req.user.id);
  await authService.deleteCookies();

  await auditService.audit({
    action: "LOGOUT_ALL_DEVICES",
    userId: req.user.id,
    metadata: {
      userId: req.user.id,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
});
