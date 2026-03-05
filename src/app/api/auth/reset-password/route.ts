import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/api/lib/db";
import AuditService from "@/api/services/AuditService";
import AuthService from "@/api/services/AuthService";
import TokenService from "@/api/services/TokenService";
import { ResetPasswordSchema } from "@/api/validators/auth";
import { TokenType } from "@/generated/prisma/enums";

export async function POST(req: NextRequest) {
  const tokenService = new TokenService();
  const auditService = new AuditService();
  const authService = new AuthService();

  const reqBody = await req.json();

  const validatedData = ResetPasswordSchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      {
        error: true,
        message: "Invalid or expired token",
      },
      { status: 400 },
    );
  }

  const { token, password } = validatedData.data;

  try {
    const hashedPassword = await authService.hashPassword(password);
    await prisma.$transaction(async (tx) => {
      const { userId, tokenId } = await tokenService.validateAndConsumeToken({
        token,
        type: TokenType.PASSWORD_RESET,
        tx,
      });
      await tx.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          loginFails: 0,
          accountLock: null,
        },
      });

      await tx.session.deleteMany({
        where: { userId },
      });

      await auditService.audit({
        action: "PASSWORD_RESET_COMPLETED",
        userId,
        metadata: { tokenId },
        tx,
      });
    });
    return NextResponse.json(
      {
        success: true,
        message: "Password reset successful",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Reset password failed", err);
    return NextResponse.json(
      {
        error: true,
        message: "Invalid or expired token",
      },
      { status: 400 },
    );
  }
}
