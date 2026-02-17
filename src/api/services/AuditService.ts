import { getClientMeta } from "@/api/lib/client";
import { prisma } from "@/api/lib/db";
import { PrismaClient } from "@prisma/client/extension";

class AuditService {
  async audit({
    action,
    userId,
    metadata,
    tx,
  }: {
    action: string;
    userId: string;
    metadata: any | null;
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
