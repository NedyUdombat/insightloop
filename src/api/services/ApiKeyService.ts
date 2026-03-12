import crypto from "node:crypto";
import type { PrismaClient } from "@prisma/client/extension";
import { prisma } from "@/api/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { ApiKeyType, Environment } from "@/generated/prisma/enums";
import type {
  ApiKeyInclude,
  ApiKeyOrderByWithRelationInput,
  ApiKeyWhereInput,
} from "@/generated/prisma/models/ApiKey";

class ApiKeyService {
  async generateApiKey({
    type = ApiKeyType.INGESTION,
    environment = Environment.PRODUCTION,
  }: {
    type: ApiKeyType;
    environment: Environment;
  }) {
    // Prefix logic: e.g., il_pk (project key) vs il_sk (secret key)
    const typePrefix = type === ApiKeyType.INGESTION ? "pk" : "sk";
    const envPrefix = environment === Environment.PRODUCTION ? "live" : "test";
    // Final prefix format: il_pk_live_
    const prefix = `il_${typePrefix}_${envPrefix}`;

    const entropy = crypto.randomBytes(32).toString("hex");
    const raw = `${prefix}_${entropy}`;
    const hash = await this.hashApiKey(raw);
    // const hash = crypto.createHash("sha256").update(raw).digest("hex");
    // Hint for UI: "il_pk_live_abcd...1234"
    const keyHint = `${prefix}_${entropy.slice(0, 4)}...${entropy.slice(-4)}`;

    return { raw, hash, keyHint };
  }

  async createApiKey({
    name,
    projectId,
    keyHash,
    keyHint,
    createdById,
    type,
    environment,
    tx,
    keyValue,
  }: {
    name: string;
    projectId: string;
    keyHash: string;
    keyHint: string;
    createdById: string;
    type: ApiKeyType;
    environment: Environment;
    tx?: PrismaClient;
    keyValue: string | null; // Optional: Store raw key value if needed (not recommended for security reasons)
  }) {
    const db = tx ?? prisma;

    return db.apiKey.create({
      data: {
        name,
        projectId,
        keyHash,
        keyHint,
        type,
        createdById,
        environment,
        keyValue: type === ApiKeyType.INGESTION ? keyValue : null, // Only store raw key for ingestion keys if needed
      },
    });
  }

  async fetchApiKeys({
    where,
    orderBy,
    tx,
  }: {
    where: ApiKeyWhereInput;
    orderBy:
      | ApiKeyOrderByWithRelationInput
      | ApiKeyOrderByWithRelationInput[]
      | undefined;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    return db.apiKey.findMany({
      where,
      orderBy,
    });
  }

  async updateApiKey({
    where,
    data,
    tx,
  }: {
    where: ApiKeyWhereInput;
    data: Prisma.ApiKeyUpdateInput;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    return db.apiKey.update({
      where,
      data,
    });
  }

  async updateManyApiKeys({
    where,
    data,
    tx,
  }: {
    where: ApiKeyWhereInput;
    data: Prisma.ApiKeyUpdateManyMutationInput;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    return db.apiKey.updateMany({
      where,
      data,
    });
  }

  async hashApiKey(apiKey: string) {
    return crypto.createHash("sha256").update(apiKey).digest("hex");
  }

  async fetchSingleApiKey({
    where,
    tx,
    include,
  }: {
    where: ApiKeyWhereInput;
    tx?: PrismaClient;
    include?: ApiKeyInclude;
  }) {
    const db = tx ?? prisma;
    return db.apiKey.findFirst({
      where,
      include,
    });
  }

  async validateApiKey({ rawKey, tx }: { rawKey: string; tx?: PrismaClient }) {
    const db = tx ?? prisma;
    const keyHash = await this.hashApiKey(rawKey);

    const apiKey = await db.apiKey.findFirst({
      where: {
        keyHash,
        deletedAt: null,
        revokedAt: null,
      },
      select: {
        id: true,
        projectId: true,
        environment: true,
      },
    });

    if (!apiKey) {
      throw new Error("Invalid API key");
    }

    return apiKey;
  }

  async revokeApiKey({
    apiKeyId,
    ownerId,
    tx,
  }: {
    apiKeyId: string;
    ownerId: string;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;

    const apiKey = await db.apiKey.findFirst({
      where: {
        id: apiKeyId,
        createdById: ownerId,
        project: {
          ownerId: ownerId,
        },
        revokedAt: null,
        deletedAt: null,
      },
    });

    if (!apiKey) {
      throw new Error("Forbidden");
    }

    return db.apiKey.update({
      where: { id: apiKeyId },
      data: { revokedAt: new Date() },
    });
  }

  async rotateApiKey({
    apiKeyId,
    ownerId,
    tx,
  }: {
    apiKeyId: string;
    ownerId: string;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;

    const apiKey = await db.apiKey.findFirst({
      where: {
        id: apiKeyId,
        createdById: ownerId,
        project: {
          ownerId: ownerId,
        },
        revokedAt: null,
        deletedAt: null,
      },
    });

    if (!apiKey) {
      throw new Error("Forbidden");
    }

    const { raw, hash } = await this.generateApiKey({
      type: apiKey.type,
      environment: apiKey.environment,
    });

    await db.apiKey.update({
      where: { id: apiKeyId },
      data: { keyHash: hash, rotatedAt: new Date() },
    });

    return raw;
  }

  async assertOwnership({
    apiKeyId,
    ownerId,
    tx,
  }: {
    apiKeyId: string;
    ownerId: string;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;

    const key = await db.apiKey.findFirst({
      where: {
        id: apiKeyId,
        project: { ownerId: ownerId },
        deletedAt: null,
        revokedAt: null,
      },
    });

    if (!key) throw new Error("Forbidden");

    return key;
  }
}

export default ApiKeyService;
