import { TokenType } from "@/generated/prisma/enums";
import { prisma } from "@/api/lib/db";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client/extension";

const DEFAULT_BYTES = 48;

class TokenService {
  async createToken({
    userId,
    expiresInMins,
    type,
  }: {
    userId: string;
    type: TokenType;
    expiresInMins?: number;
  }): Promise<{ token: string; expiresAt: Date }> {
    const token = this.generateRawToken();
    const tokenHash = this.hashToken(token);
    const duration =
      expiresInMins ?? (type === "PASSWORD_RESET" ? 30 : 60 * 24);
    const expiresAt = new Date(Date.now() + duration * 60 * 1000);

    await prisma.token.create({
      data: {
        userId,
        type,
        expiresAt,
        tokenHash,
      },
    });

    return { token, expiresAt };
  }

  async validateAndConsumeToken({
    token,
    type,
    tx,
  }: {
    token: string;
    type: TokenType;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    const tokenHash = this.hashToken(token);

    const foundToken = await prisma.token.findFirst({
      where: { tokenHash, type },
    });

    if (!foundToken) throw new Error("Invalid token");
    if (foundToken.usedAt) throw new Error("Token already used");
    if (foundToken.expiresAt.getTime() < Date.now())
      throw new Error("Token expired");

    const okToken = this.timingSafeEqualHex(foundToken.tokenHash, tokenHash);
    if (!okToken) throw new Error("Invalid token");

    await db.token.update({
      where: { id: foundToken.id },
      data: { usedAt: new Date() },
    });

    return { userId: foundToken.userId, tokenId: foundToken.id };
  }

  async invalidateTokenById(id: string) {
    return prisma.token.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async revokeAllUserTokens({
    userId,
    type,
  }: {
    userId: string;
    type?: TokenType;
  }) {
    const where = type ? { userId, type } : { userId };

    return prisma.token.updateMany({
      where,
      data: { usedAt: new Date() },
    });
  }

  async cleanupExpiredTokens(olderThanDays = 30) {
    const cutOff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    return prisma.token.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { createdAt: { lt: cutOff } }],
      },
    });
  }

  async rotateVerificationToken(userId: string) {
    return prisma.$transaction(async (tx) => {
      await tx.token.updateMany({
        where: {
          userId,
          type: TokenType.EMAIL_VERIFICATION,
        },
        data: { usedAt: new Date() },
      });

      const token = this.generateRawToken();
      const tokenHash = this.hashToken(token);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await tx.token.create({
        data: {
          userId,
          type: TokenType.EMAIL_VERIFICATION,
          expiresAt,
          tokenHash,
        },
      });

      return { token, expiresAt };
    });
  }

  async rotatePasswordResetToken(userId: string) {
    return prisma.$transaction(async (tx) => {
      await tx.token.updateMany({
        where: {
          userId,
          type: TokenType.PASSWORD_RESET,
        },
        data: { usedAt: new Date() },
      });

      const token = this.generateRawToken();
      const tokenHash = this.hashToken(token);
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      await tx.token.create({
        data: {
          userId,
          type: TokenType.PASSWORD_RESET,
          expiresAt,
          tokenHash,
        },
      });

      return { token, expiresAt };
    });
  }

  private base64Url(buffer: Buffer) {
    return buffer
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  private generateRawToken(bytes = DEFAULT_BYTES) {
    return this.base64Url(crypto.randomBytes(bytes));
  }

  private hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  private timingSafeEqualHex(aHex: string, bHex: string) {
    const a = Buffer.from(aHex, "hex");
    const b = Buffer.from(bHex, "hex");

    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }
}

export default TokenService;
