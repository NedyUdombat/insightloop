import { getClientIp } from "@/api/lib/client";
import AuditService from "@/api/services/AuditService";
import EmailService from "@/api/services/EmailService";
import RateLimitService from "@/api/services/RateLimitService";
import TokenService from "@/api/services/TokenService";
import UserService from "@/api/services/UserService";
import { EmailOnlySchema } from "@/api/validators/auth";
import { type NextRequest, NextResponse } from "next/server";

const GENERIC_RESPONSE = {
  success: true,
  message: "Password reset email has been sent.",
};

export async function POST(req: NextRequest) {
  const userService = new UserService();
  const tokenService = new TokenService();
  const rateLimitService = new RateLimitService();
  const auditService = new AuditService();
  const emailService = EmailService.getInstance();

  const reqBody = await req.json();

  const validatedData = EmailOnlySchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  }

  const { email } = validatedData.data;
  const normalizedEmail = email.toLowerCase();

  const ip = await getClientIp();

  const [ipLimit, emailLimit] = await Promise.all([
    rateLimitService.hit({
      key: "FORGOT_PASSWORD",
      identifier: ip,
      maxRequests: 3,
      windowMs: 10 * 60 * 1000,
    }),
    rateLimitService.hit({
      key: "FORGOT_PASSWORD",
      identifier: normalizedEmail,
      maxRequests: 3,
      windowMs: 10 * 60 * 1000,
    }),
  ]);

  if (!ipLimit.allowed || !emailLimit.allowed) {
    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  }

  try {
    const user = await userService.fetchUserByEmail({ email: normalizedEmail });
    if (!user || user.emailVerified === false || user.deletedAt) {
      return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
    }

    const { token } = await tokenService.rotatePasswordResetToken(user.id);

    await emailService.sendPasswordResetEmail({
      to: user.email,
      firstName: user.firstname,
      token,
    });

    await auditService.audit({
      action: "PASSWORD_RESET_REQUESTED",
      userId: user.id,
      metadata: { email: user.email },
    });

    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  } catch (err) {
    console.error("Forgot password failed", err);
    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  }
}
