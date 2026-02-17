import { prisma } from "@/api/lib/db";

type RateLimitParams = {
  key: string; // "signup" | "login" | etc
  maxRequests: number; // e.g. 5
  windowMs: number; // e.g. 10 * 60 * 1000
  identifier: string;
};

class RateLimitService {
  async hit({ key, maxRequests, windowMs, identifier }: RateLimitParams) {
    const since = new Date(Date.now() - windowMs);

    const logCount = await prisma.rateLimitLog.count({
      where: {
        key,
        identifier,
        createdAt: { gte: since },
      },
    });

    if (logCount >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    await prisma.rateLimitLog.create({
      data: {
        key,
        identifier,
      },
    });

    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - (logCount + 1)),
    };
  }

  async deleteLogs(email: string) {
    return prisma.rateLimitLog.deleteMany({
      where: { identifier: email },
    });
  }
}

export default RateLimitService;
