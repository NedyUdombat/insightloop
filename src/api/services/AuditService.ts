import type { PrismaClient } from "@prisma/client/extension";
import { getClientMeta } from "@/api/lib/client";
import { prisma } from "@/api/lib/db";

class AuditService {
  async audit({
    action,
    userId,
    metadata,
    tx,
  }: {
    action: string;
    userId: string;
    metadata: Record<string, unknown> | null;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    const { ip, userAgent } = await getClientMeta();

    await db.auditLog.create({
      data: {
        action,
        userId,
        metadata,
        ip,
        userAgent,
      },
    });
  }
}

export default AuditService;
