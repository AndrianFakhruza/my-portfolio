import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "andrian-super-secret-editorial-portfolio-key-2026"
);

const TOKEN_COOKIE_NAME = "andrian_admin_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      loginUrl.searchParams.set("reason", "expired");
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(TOKEN_COOKIE_NAME);
      return response;
    }
  }

  // Also protect modifying API routes if needed, e.g. POST/PUT/DELETE
  if (
    pathname.startsWith("/api/projects") ||
    pathname.startsWith("/api/categories") ||
    pathname.startsWith("/api/posts") ||
    pathname.startsWith("/api/messages") ||
    pathname.startsWith("/api/upload")
  ) {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
      // Allow public contact creation on POST /api/contact
      if (pathname === "/api/contact" && request.method === "POST") {
        return NextResponse.next();
      }

      const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      try {
        await jwtVerify(token, JWT_SECRET);
      } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/projects/:path*",
    "/api/categories/:path*",
    "/api/posts/:path*",
    "/api/messages/:path*",
    "/api/upload/:path*",
  ],
};

