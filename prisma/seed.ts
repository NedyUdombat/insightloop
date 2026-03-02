import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { Pool } from "pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // console.log("Seeding database...");
  // // const password = await argon2.hash("SlowMotion48.", {
  // //   parallelism: 1,
  // // });
  // // const nedy = await prisma.user.upsert({
  // //   where: { email: "nedyudombat@gmail.com" },
  // //   update: {},
  // //   create: {
  // //     email: "nedyudombat@gmail.com",
  // //     firstname: "Nedy",
  // //     lastname: "Udombat",
  // //     emailVerified: true,
  // //     emailVerifiedAt: new Date(),
  // //     password,
  // //   },
  // // });
  // const projectId = "019cab74-c8ef-7578-9201-9aba0ffa4792";
  // const [endUser, firstEvent] = await prisma.$transaction(async (tx) => {
  //   const endUser = await tx.endUser.create({
  //     data: {
  //       name: "test end user",
  //       email: "test@example.com",
  //       projectId: projectId,
  //     },
  //   });
  //   const firstEvent = await tx.event.create({
  //     data: {
  //       eventName: "User Signed Up",
  //       eventTimestamp: new Date(),
  //       projectId,
  //       environment: "PRODUCTION",
  //       properties: {
  //         plan: "Pro",
  //         referrer: "Google",
  //       },
  //       createdById: "019cab74-66df-7729-b1ba-edfae5227c25",
  //       endUserId: endUser.id,
  //     },
  //   });
  //   return [endUser, firstEvent];
  // });
  // console.log("Seeding completed for:", endUser, firstEvent);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
