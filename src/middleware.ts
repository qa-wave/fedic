import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as { role?: string } | undefined)?.role;

  // Public paths — no protection
  const publicPaths = ["/", "/login", "/api/auth", "/api/health"];
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Static assets and Next.js internals
  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Prevent clients from accessing admin routes
  if (pathname.startsWith("/admin") && role === "client") {
    return NextResponse.redirect(new URL("/portal", req.nextUrl.origin));
  }

  // Prevent clients from accessing dashboard routes (except portal)
  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/faktury") || pathname.startsWith("/adresar") || pathname.startsWith("/banka") || pathname.startsWith("/pokladna") || pathname.startsWith("/prehled")) && role === "client") {
    return NextResponse.redirect(new URL("/portal", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
