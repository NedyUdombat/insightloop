import { NextRequest, NextResponse } from "next/server";
import { CreateUserSchema } from "@/api/validators/user";
import UserService from "@/api/services/UserService";
import AuthService from "@/api/services/AuthService";
import AuditService from "@/api/services/AuditService";
import RateLimitService from "@/api/services/RateLimitService";
import EmailService from "@/api/services/EmailService";
import TokenService from "@/api/services/TokenService";
import { getClientIp, getClientMeta } from "@/api/lib/client";
import { isUniqueConstraintError } from "@/api/lib/error";
import { TokenType } from "@/generated/prisma/enums";
import { prisma } from "@/api/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

const isProd =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
  process.env.NODE_ENV === "production";
const domain = process.env.NEXT_PUBLIC_VERCEL_URL;

const MAX_SESSIONS = 5;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function POST(req: NextRequest) {
  const authService = new AuthService();
  const userService = new UserService();
  const rateLimiter = new RateLimitService();
  const emailService = EmailService.getInstance();
  const tokenService = new TokenService();

  const reqBody = await req.json();

  const validatedData = CreateUserSchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      {
        error: true,
        message: "Invalid request data",
      },
      { status: 400 },
    );
  }

  const { email, password, firstname, lastname } = validatedData.data;
  const normalizedEmail = email.toLowerCase();

  const ip = await getClientIp();

  const [ipLimit, emailLimit] = await Promise.all([
    rateLimiter.hit({
      key: "SIGNUP",
      maxRequests: 5, // 5 attempts
      windowMs: 10 * 60 * 1000, // per 10 minutes
      identifier: ip,
    }),

    rateLimiter.hit({
      key: "SIGNUP",
      maxRequests: 5, // 5 attempts
      windowMs: 10 * 60 * 1000, // per 10 minutes
      identifier: normalizedEmail,
    }),
  ]);

  if (!ipLimit.allowed || !emailLimit.allowed) {
    return NextResponse.json(
      {
        error: true,
        message: "Too many registration attempts. Try again later.",
      },
      { status: 429 },
    );
  }

  try {
    const hashedPassword = await authService.hashPassword(password);
    const newUser = await userService.createUser({
      email: normalizedEmail,
      password: hashedPassword,
      firstname,
      lastname,
    });

    const user = await userService.serializeUser(newUser);

    try {
      const { token } = await tokenService.createToken({
        userId: user.id,
        type: TokenType.EMAIL_VERIFICATION,
      });

      await emailService.sendVerificationEmail({
        to: user.email,
        token,
        firstName: user.firstname,
      });
    } catch (emailError) {
      console.error("Verification email failed to send", emailError);
    }

    const auditService = new AuditService();
    await auditService.audit({
      action: "REGISTER",
      userId: user.id,
      metadata: null,
    });

    // Create session so user can resend verification without exposing email
    const cookieStore = await cookies();
    const { userAgent } = await getClientMeta();
    const csrfToken = crypto.randomUUID();

    const sessionCount = await prisma.session.count({
      where: { userId: newUser.id },
    });

    if (sessionCount >= MAX_SESSIONS) {
      const oldestSession = await prisma.session.findFirst({
        where: { userId: newUser.id },
        orderBy: { createdAt: "asc" },
      });
      if (oldestSession) {
        await prisma.session.delete({ where: { id: oldestSession.id } });
      }
    }

    const session = await authService.createSession({
      userId: newUser.id,
      ip,
      userAgent,
      csrfToken,
    });

    cookieStore.set("session_id", session.id, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_MS / 1000,
      domain: isProd ? `.${domain}` : undefined,
    });

    cookieStore.set("csrf_token", csrfToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    });

    cookieStore.set("email_verified", "false", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully. Please check your email to verify your account.",
        data: [],
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return NextResponse.json(
        {
          error: true,
          message: "Email already in use",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: true,
        message: "Unable to create account",
      },
      { status: 500 },
    );
  }
}
