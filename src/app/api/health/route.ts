import { NextResponse } from "next/server";
import DBService from "@/api/services/DBService";

export const GET = async () => {
  const dbService = new DBService();
  const isDbConnected = await dbService.checkDbConnection();

  if (!isDbConnected) {
    return NextResponse.json(
      { status: "error", message: "Database connection failed" },
      { status: 503 },
    );
  }
  return NextResponse.json(
    { status: "success", message: "Database connection successful" },
    { status: 200 },
  );
};
