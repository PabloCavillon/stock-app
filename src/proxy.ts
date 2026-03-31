import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

const roleRoutes: Record<string, string[]> = {
	"/products": ["ADMIN", "SELLER"],
	"/customers": ["ADMIN", "SELLER"],
	"/stock": ["ADMIN", "WAREHOUSE"],
	"/users": ["ADMIN"],
	"/orders": ["ADMIN", "SELLER", "WAREHOUSE"],
};

export default auth((req) => {
	const isLoggedIn = !!req.auth;
	const { pathname } = req.nextUrl;
	const isLoginPage = pathname === "/login";

	if (!isLoggedIn && !isLoginPage) {
		return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
	}

	if (isLoggedIn && isLoginPage) {
		const role = (req.auth?.user as any)?.role ?? "SELLER";
		const defaultRoute = role === "WAREHOUSE" ? "/stock" : "/orders";
		return NextResponse.redirect(new URL(defaultRoute, req.nextUrl.origin));
	}

	if (isLoggedIn) {
		const role = (req.auth?.user as any)?.role;

		for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
			if (pathname.startsWith(route)) {
				if (!role || !allowedRoles.includes(role)) {
					return NextResponse.redirect(
						new URL("/orders", req.nextUrl.origin),
					);
				}
			}
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
};
