import { NextResponse, NextRequest } from "next/server";
import { verifyAuth } from "./utils/server/auth";

const PUBLIC_FILE = /\.(.*)$/;

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.url;
  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    url.includes("/_next") ||
    pathname.startsWith("/static") || // exclude static files
    url.includes("/static") ||
    pathname.startsWith("/api/v1/crons") || // exclude crons
    pathname.startsWith("/api/v1/users/sign-up") || // exclude sign up route
    pathname.startsWith("/api/v1/users/login") || //exclude login route
    pathname.startsWith("/api/v1/users/logout") || // exclude logout route
    pathname.startsWith("/api/v1/users/forgot-password") || // exclude forgot-password route
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }
  console.log("running middleware");

  const token = req.cookies.get("user-token")?.value || "";
  const validationResp = await verifyAuth(token);
  const verifiedToken = validationResp.success;

  if ((url.includes("/login") || url.includes("/sign-up")) && verifiedToken) {
    return NextResponse.redirect(new URL("/dashboard", url));
  }

  if (!verifiedToken && !url.includes("/login") && !url.includes("/sign-up")) {
    return NextResponse.redirect(new URL("/login", url));
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
