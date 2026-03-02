import { prisma } from "@/api/lib/db";
import { cookies, headers } from "next/headers";
import * as argon2 from "argon2";
import { ISession } from "@/api/types/ISession";
import { addMinutes } from "date-fns";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const ROLLING_THRESHOLD_MS = 1000 * 60 * 60 * 24; // 1 day
const ABSOLUTE_SESSION_LIFETIME_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

class AuthService {
  async createSession({
    userId,
    ip,
    userAgent,
    csrfToken,
  }: {
    userId: string;
    ip: string;
    userAgent: string;
    csrfToken: string;
  }) {
    return prisma.session.create({
      data: {
        userId,
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
        ip,
        userAgent,
        csrfToken,
        maxExpiresAt: new Date(Date.now() + ABSOLUTE_SESSION_LIFETIME_MS),
      },
    });
  }

  async deleteCookies() {
    const cookieStore = await cookies();
    cookieStore.delete("session_id");
    cookieStore.delete("csrf_token");
    cookieStore.delete("email_verified");
  }

  async destroySession(sessionId: string) {
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
  }

  async destroyAllSessions(userId: string) {
    await prisma.session.deleteMany({
      where: {
        userId,
      },
    });
  }

  async loadSession(sessionId: string) {
    return prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
  }

  async getSession() {
    const sessionId = await this.getSessionFromCookie();

    if (!sessionId) return null;

    const session = await this.loadSession(sessionId);
    if (!session) return null;

    const isValidSession = this.validateSession(session);
    if (!isValidSession) return null;

    await this.extendSession(session);
    return session;
  }

  async extendSession(session: ISession) {
    if (!session || !session.expiresAt) return;
    const timeLeft = session.expiresAt?.getTime() - Date.now();

    if (timeLeft > ROLLING_THRESHOLD_MS) return;

    await prisma.session.update({
      where: { id: session.id },
      data: {
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      },
    });
  }

  async validateCSRFToken() {
    const headerStore = await headers();
    const csrfHeader = headerStore.get("x-csrf-token");
    const session = await this.getSession();

    if (!session || session.csrfToken !== csrfHeader) {
      throw new Error("INVALID_CSRF");
    }

    return session;
  }

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      parallelism: 1,
    });
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
  }

  async isAccountRestricted(user: {
    accountLock: Date | null;
    bannedAt: Date | null;
  }) {
    if (user.bannedAt)
      return {
        value: true,
        message: "Account Banned. Please contact support.",
        status: 403,
      };
    if (user.accountLock && user.accountLock > new Date())
      return {
        value: true,
        message: "Account Locked. Try again later.",
        status: 429,
      };
    return { value: false };
  }

  async recordFailedLogin(userId: string, currentFails: number | null) {
    const loginFails = (currentFails ?? 0) + 1;
    const accountLock = loginFails >= 5 ? addMinutes(new Date(), 15) : null;

    await prisma.user.update({
      where: { id: userId },
      data: {
        loginFails,
        accountLock,
      },
    });
  }

  async resetLoginFailures(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        loginFails: 0,
        accountLock: null,
      },
    });
  }

  private async getSessionFromCookie() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    return sessionId ?? null;
  }

  private validateSession(session: ISession) {
    if (!session) return false;
    if (session.revokedAt) return false;

    if (session.maxExpiresAt && session.maxExpiresAt < new Date()) return false;
    return !(session.expiresAt && session.expiresAt < new Date());
  }
}

export default AuthService;
