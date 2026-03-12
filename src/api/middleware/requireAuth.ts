import { type NextRequest, NextResponse } from "next/server";
import AuthService from "@/api/services/AuthService";
import type { PublicUser } from "../types/IUser";

export type AuthenticatedRequest = NextRequest & {
  user: PublicUser;
  session: {
    id: string;
  };
  params?: Record<string, string>;
};

type RouteContext = {
  params?: Promise<Record<string, string>>;
};

export function requireAuth<
  T extends (req: AuthenticatedRequest) => Promise<Response>,
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
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        emailVerified: user.emailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastProjectId: user.lastProjectId,
        globalNotificationsEnabled: user.globalNotificationsEnabled,
        notificationChannels: user.notificationChannels,
        quietHoursStart: user.quietHoursStart,
        quietHoursEnd: user.quietHoursEnd,
        digestFrequency: user.digestFrequency,
      };
      (req as AuthenticatedRequest).session = {
        id: session.id,
      };

      (req as AuthenticatedRequest).params = await ctx.params;

      return handler(req as AuthenticatedRequest);
    } catch (err) {
      console.error("Auth middleware failed", err);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
}
