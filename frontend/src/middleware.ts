import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/complex"];
const AUTH_ROUTES = ["/login"];

export function middleware(req: NextRequest) {
	const token = req.cookies.get("access_token")?.value;
	const { pathname } = req.nextUrl;

	if (PROTECTED_ROUTES.some((p) => pathname.startsWith(p)) && !token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// login page + token bor → comple
	if (AUTH_ROUTES.includes(pathname) && token) {
		return NextResponse.redirect(new URL("/complex", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/complex/:path*", "/login"],
};
