import { NextResponse, NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.toString();
  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    url.includes("/_next") ||
    pathname.startsWith("/static") || // exclude static files
    url.includes("/static") ||
    // pathname === "/" || // Exclude the homepage
    pathname.startsWith("/api/v1/crons") || // exclude crons
    pathname.startsWith("/api/v1/user/sign-up") || // exclude sign up route
    pathname.startsWith("/api/v1/user/login") || //exclude login route
    pathname.startsWith("/api/v1/user/logout") || // exclude logout route
    pathname.startsWith("/api/v1/user/forgot-password") || // exclude forgot-password route
    pathname.startsWith("/api/v1/user/reset-password") || // exclude reset-password route
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }
  console.log("running middleware");

  const token = req.cookies.get("user-token")?.value || "";

  try {
    const res = await fetch(`${req.nextUrl.origin}/api/v1/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const validationResp = await res.json();
    const verifiedToken = validationResp.success;

    // Handle API routes
    if (pathname.startsWith('/api/')) {
      if (!verifiedToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.next();
    }

    if ((pathname === "/login" || pathname === "/sign-up") && verifiedToken) {
      return NextResponse.redirect(new URL("/dashboard", url));
    }

    if (!verifiedToken && !pathname.startsWith("/login") && !pathname.startsWith("/sign-up")) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/api/v1/:path*",
    "/login",
    "/sign-up",
    "/my-profile",
    "/dashboard",
  ],
};
