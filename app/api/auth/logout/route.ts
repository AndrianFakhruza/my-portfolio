import { NextResponse } from "next/server";
import { TOKEN_COOKIE_NAME, getSession } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(TOKEN_COOKIE_NAME);
  return response;
}

