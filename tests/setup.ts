import { afterAll, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { getPrisma } from "@/api/lib/db";
// import {PrismaClient} from "@prisma/client/extension";
//
// const prisma = new PrismaClient();

beforeAll(async () => {
  require("dotenv").config({ path: ".env.test" });
  console.log("TEST DATABASE_URL:", process.env.DATABASE_URL);

  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
  });
});

afterAll(async () => {
  const prisma = getPrisma();
  await prisma.$disconnect();
});
