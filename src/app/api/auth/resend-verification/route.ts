import { type NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/api/lib/client";
import AuditService from "@/api/services/AuditService";
import AuthService from "@/api/services/AuthService";
import EmailService from "@/api/services/EmailService";
import RateLimitService from "@/api/services/RateLimitService";
import TokenService from "@/api/services/TokenService";

const GENERIC_RESPONSE = {
  success: true,
  message: "Verification email has been sent.",
};

export async function POST(_req: NextRequest) {
  const authService = new AuthService();
  const tokenService = new TokenService();
  const auditService = new AuditService();
  const rateLimitService = new RateLimitService();
  const emailService = EmailService.getInstance();

  const ip = await getClientIp();

  // Identify user from session — no email from the client
  const session = await authService.getSession();
  if (!session || !session.user) {
    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  }

  const { user } = session;

  if (user.emailVerified || user.deletedAt) {
    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  }

  const [ipLimit, userLimit] = await Promise.all([
    rateLimitService.hit({
      key: "RESEND_VERIFICATION",
      identifier: ip,
      maxRequests: 3,
      windowMs: 10 * 60 * 1000,
    }),
    rateLimitService.hit({
      key: "RESEND_VERIFICATION",
      identifier: user.id,
      maxRequests: 3,
      windowMs: 10 * 60 * 1000,
    }),
  ]);

  if (!ipLimit.allowed || !userLimit.allowed) {
    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  }

  try {
    const { token } = await tokenService.rotateVerificationToken(user.id);

    await emailService.sendVerificationEmail({
      to: user.email,
      firstName: user.firstName,
      token,
    });

    await auditService.audit({
      action: "RESEND_VERIFICATION_EMAIL",
      userId: user.id,
      metadata: { email: user.email },
    });

    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  } catch (err) {
    console.error("Resend verification failed", err);
    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  }
}
