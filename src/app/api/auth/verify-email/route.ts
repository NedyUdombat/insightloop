import { NextRequest, NextResponse } from "next/server";
import UserService from "@/api/services/UserService";
import AuditService from "@/api/services/AuditService";
import TokenService from "@/api/services/TokenService";
import { TokenType } from "@/generated/prisma/enums";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const tokenService = new TokenService();
  const userService = new UserService();
  const auditService = new AuditService();
  const cookieStore = await cookies();

  const body = await req.json();
  const token = body.token as string | undefined;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Missing token", data: [] },
      { status: 400 },
    );
  }

  try {
    const { userId } = await tokenService.validateAndConsumeToken({
      token,
      type: TokenType.EMAIL_VERIFICATION,
    });

    await userService.updateUser({
      where: { id: userId },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    });

    cookieStore.set("email_verified", "true", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    await auditService.audit({
      action: "EMAIL_VERIFIED",
      userId,
      metadata: null,
    });

    const hasSession = !!cookieStore.get("session_id")?.value;

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      data: { hasSession },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired verification link",
        data: [],
      },
      { status: 400 },
    );
  }
}
