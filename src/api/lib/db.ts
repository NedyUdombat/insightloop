import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

console.log("connectionString", connectionString, process.env.DATABASE_URL);

const adapter = new PrismaPg({
  connectionString,
});
const globalPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prisma;
