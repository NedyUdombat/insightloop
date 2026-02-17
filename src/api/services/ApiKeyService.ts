import crypto from "crypto";
import { PrismaClient } from "@prisma/client/extension";
import { prisma } from "@/api/lib/db";
import {
  ApiKeyOrderByWithRelationInput,
  ApiKeyWhereInput,
  ApiKeyWhereUniqueInput,
} from "@/generated/prisma/models/ApiKey";

const LIVE_KEY_PREFIX = "il_pk_live";

class ApiKeyService {
  async generateApiKey() {
    const raw = `${LIVE_KEY_PREFIX}_${crypto.randomBytes(32).toString("hex")}`;
    const hash = crypto.createHash("sha256").update(raw).digest("hex");

    return { raw, hash };
  }

  async createApiKey({
    name,
    projectId,
    keyHash,
    createdById,
    tx,
  }: {
    name: string;
    projectId: string;
    keyHash: string;
    createdById: string;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;

    return db.apiKey.create({
      data: {
        name,
        projectId,
        keyHash,
        createdById,
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
    where: ApiKeyWhereUniqueInput;
    data: any;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    return prisma.apiKey.update({
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
    data: any;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    return prisma.apiKey.updateMany({
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
    where: ApiKeyWhereUniqueInput;
    tx?: PrismaClient;
    include?: Record<string, any>;
  }) {
    const db = tx ?? prisma;
    return db.apiKey.findFirst({
      where,
      include,
    });
  }
}

export default ApiKeyService;
