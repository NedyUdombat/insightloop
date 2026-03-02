import { prisma } from "@/api/lib/db";
import { type NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/verify-email/error",
];

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore next internals & static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // --- Read session cookies ---
  const session = req.cookies.get("session_id")?.value;
  const emailVerified = req.cookies.get("email_verified")?.value === "true";

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // 1️⃣ Not logged in
  if (!session) {
    if (isAuthRoute) return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (session) {
    const existingSession = await prisma.session.findUnique({
      where: { id: session },
      include: { user: true },
    });

    if (!existingSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";

      const response = NextResponse.redirect(url);
      response.cookies.delete("session_id");
      response.cookies.delete("email_verified");

      return response;
    }
  }

  // 2️⃣ Logged in but email NOT verified
  if (!emailVerified) {
    if (pathname.startsWith("/auth/verify-email")) {
      return NextResponse.next();
    }

    const url = req.nextUrl.clone();
    url.pathname = "/auth/verify-email/error";
    url.searchParams.set("reason", "email_not_verified");
    return NextResponse.redirect(url);
  }

  // 3️⃣ Logged in + verified, block auth pages
  if (isAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
  runtime: "nodejs",
};
