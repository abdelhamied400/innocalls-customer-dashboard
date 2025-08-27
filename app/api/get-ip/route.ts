import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.toString().split(",")[0];
  return Response.json({ ip });
}
