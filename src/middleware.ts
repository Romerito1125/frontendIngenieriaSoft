import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/denuncias", "/noticias", "/saldo-y-recargas", "/rutas"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/denuncias/:path*", "/noticias/:path*", "/saldo-y-recargas/:path*", "/rutas/:path*"],
};
    