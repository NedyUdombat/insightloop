import { NextResponse } from "next/server";
import UserService from "@/api/services/UserService";
import AuthService from "@/api/services/AuthService";
import RateLimitService from "@/api/services/RateLimitService";
import AuditService from "@/api/services/AuditService";
import { requireAuth } from "@/api/middleware/requireAuth";

export const DELETE = requireAuth(async (req) => {
  const authService = new AuthService();
  const userService = new UserService();
  const rateLimitService = new RateLimitService();
  const auditService = new AuditService();

  await authService.destroyAllSessions(req.user.id);
  await authService.deleteCookies();
  // hard-delete all password reset tokens
  await rateLimitService.deleteLogs(req.user.email);
  // soft delete all projects
  await userService.deleteUser(req.user.id);

  await auditService.audit({
    action: "ACCOUNT_DELETED",
    userId: req.user.id,
    metadata: null,
  });
  return NextResponse.json({ success: true }, { status: 200 });
});
