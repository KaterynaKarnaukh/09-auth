import { NextRequest, NextResponse } from "next/server";
 
const PRIVATE_ROUTES = ["/profile", "/notes"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];
 
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = !!(accessToken || refreshToken);
 
  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));
  const isAuth = AUTH_ROUTES.some((r) => pathname.startsWith(r));
 
  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
 
  if (isAuth && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }
 
  return NextResponse.next();
}
 
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
 