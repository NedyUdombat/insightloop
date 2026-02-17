import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";

export const GET = requireAuth(async (req) => {
  return NextResponse.json(
    {
      success: true,
      data: req.user,
    },
    { status: 200 },
  );
});
