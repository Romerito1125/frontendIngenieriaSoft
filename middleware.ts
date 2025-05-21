import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/denuncias", "/noticias", "/saldo-y-recargas", "/rutas"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const protectedRoutes = ["/", "/denuncias", "/noticias", "/saldo-y-recargas"];

  const isProtected = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/denuncias/:path*", "/noticias/:path*", "/saldo-y-recargas/:path*"],
};

    