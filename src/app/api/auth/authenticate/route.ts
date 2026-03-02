import { getClientIp, getClientMeta } from "@/api/lib/client";
import { prisma } from "@/api/lib/db";
import AuditService from "@/api/services/AuditService";
import AuthService from "@/api/services/AuthService";
import RateLimitService from "@/api/services/RateLimitService";
import UserService from "@/api/services/UserService";
import { LoginSchema } from "@/api/validators/user";
import crypto from "crypto";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const isProd =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
  process.env.NODE_ENV === "production";
const domain = process.env.NEXT_PUBLIC_VERCEL_URL;

const MAX_SESSIONS = 5;

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function POST(req: NextRequest) {
  const authService = new AuthService();
  const userService = new UserService();
  const rateLimitService = new RateLimitService();
  const auditService = new AuditService();

  const reqBody = await req.json();

  const validatedData = LoginSchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      {
        error: true,
        message: "Invalid request data",
      },
      { status: 400 },
    );
  }

  const { email, password } = validatedData.data;
  const normalizedEmail = email.toLowerCase();

  const ip = await getClientIp();

  const [ipLimit, emailLimit] = await Promise.all([
    rateLimitService.hit({
      key: "LOGIN",
      maxRequests: 5, // 5 attempts
      windowMs: 10 * 60 * 1000, // per 10 minutes
      identifier: ip,
    }),

    rateLimitService.hit({
      key: "LOGIN",
      maxRequests: 5, // 5 attempts
      windowMs: 10 * 60 * 1000, // per 10 minutes
      identifier: normalizedEmail,
    }),
  ]);

  if (!ipLimit.allowed || !emailLimit.allowed) {
    return NextResponse.json(
      {
        error: true,
        message: "Too many login attempts. Try again later.",
      },
      { status: 429 },
    );
  }

  const user = await userService.fetchUserByEmail({
    email: normalizedEmail,
    include: { projects: { select: { id: true } } },
  });
  if (!user || user.deletedAt) {
    return NextResponse.json(
      {
        error: true,
        message: "Invalid credentials",
      },
      { status: 401 },
    );
  }

  const isAccountRestricted = await authService.isAccountRestricted(user);

  if (isAccountRestricted.value) {
    return NextResponse.json(
      {
        error: true,
        message: isAccountRestricted.message,
      },
      { status: isAccountRestricted.status },
    );
  }

  const verifiedPassword = await authService.verifyPassword(
    password,
    user.password,
  );

  if (!verifiedPassword) {
    await authService.recordFailedLogin(user.id, user.loginFails);
    return NextResponse.json(
      {
        error: true,
        message: "Invalid credentials",
      },
      { status: 401 },
    );
  }
  await authService.resetLoginFailures(user.id);

  const cookieStore = await cookies();

  const { userAgent } = await getClientMeta();

  const sessionCount = await prisma.session.count({
    where: { userId: user.id },
  });

  if (sessionCount >= MAX_SESSIONS) {
    const oldestSession = await prisma.session.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    if (oldestSession) {
      await prisma.session.delete({ where: { id: oldestSession.id } });
    }
  }

  const csrfToken = crypto.randomUUID();

  const session = await authService.createSession({
    userId: user.id,
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

  // 3️⃣ Set cookie for middleware gating
  cookieStore.set("email_verified", user.emailVerified ? "true" : "false", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  await userService.updateUser({
    where: { id: user.id },
    data: {
      lastAccessed: new Date(),
    },
  });
  await auditService.audit({
    action: user.emailVerified
      ? "LOGIN_SUCCESSFUL"
      : "LOGIN_SUCCESSFUL_UNVERIFIED",
    userId: user.id,
    metadata: {
      email: normalizedEmail,
      sessionId: session.id,
    },
  });
  const publicUser = await userService.serializeUser(user);
  return NextResponse.json(
    { success: true, message: "Authentication successful", data: publicUser },
    {
      status: 200,
    },
  );
}
