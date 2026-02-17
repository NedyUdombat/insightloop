import { prisma } from "@/api/lib/db";

class DBService {
  async checkDbConnection() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("Database connection successful.");
      return true;
    } catch (error) {
      console.error(`Database connection failed: ${error}`);
      return false;
    }
  }
}

export default DBService;
