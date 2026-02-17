import { NextRequest, NextResponse } from "next/server";
import AuthService from "@/api/services/AuthService";

export type AuthenticatedRequest = NextRequest & {
  user: {
    id: string;
    email: string;
    role: string;
  };
  session: {
    id: string;
  };
  params: Record<string, string>;
};

type RouteContext = {
  params?: Promise<Record<string, string>>;
};

export function requireAuth<
  T extends (req: AuthenticatedRequest, ctx: RouteContext) => Promise<Response>,
>(handler: T) {
  return async (req: NextRequest, ctx: RouteContext) => {
    try {
      const authService = new AuthService();

      const session = await authService.getSession();

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = session.user;
      if (!user || user.deletedAt || user.bannedAt || user.accountLock) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      (req as AuthenticatedRequest).user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      (req as AuthenticatedRequest).session = {
        id: session.id,
      };

      // 🔑 normalize params
      if (ctx?.params instanceof Promise) {
        (req as AuthenticatedRequest).params = await ctx.params;
      }

      return handler(req as AuthenticatedRequest, ctx);
    } catch (err) {
      console.error("Auth middleware failed", err);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
}
