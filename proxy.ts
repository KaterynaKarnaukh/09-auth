import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";
import { parse } from "cookie";
import type { AxiosResponse } from "axios";
 
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
 
  const isPrivate =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isAuth = pathname === "/sign-in" || pathname === "/sign-up";
 
  if (accessToken) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    return NextResponse.next();
  }
 
  if (refreshToken) {
    try {
      const response: AxiosResponse = await checkSession();
      const setCookie = response.headers["set-cookie"] as string[] | string | undefined;
 
      const nextResponse = isAuth
        ? NextResponse.redirect(new URL("/profile", request.url))
        : NextResponse.next();
 
      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path ?? "/",
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
          };
          if (parsed.accessToken)
            nextResponse.cookies.set("accessToken", parsed.accessToken, options);
          if (parsed.refreshToken)
            nextResponse.cookies.set("refreshToken", parsed.refreshToken, options);
        }
      }
 
      return nextResponse;
    } catch {
      if (isPrivate) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
      return NextResponse.next();
    }
  }
 
  if (isPrivate) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
 
  return NextResponse.next();
}
 
export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};