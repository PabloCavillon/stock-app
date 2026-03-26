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
	const isLoginPage = req.nextUrl.pathname === "/login";

	if (!isLoggedIn && !isLoginPage) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	if (isLoggedIn && isLoginPage) {
		const role = (req.auth?.user as any)?.role ?? "SELLER";
		const defaultRoute = role === "WAREHOUSE" ? "/orders" : "/orders";
		return NextResponse.redirect(new URL(defaultRoute, req.url));
	}

	if (isLoggedIn) {
		const role = (req.auth?.user as any)?.role ?? "SELLER";
		const pathname = req.nextUrl.pathname;

		for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
			if (pathname.startsWith(route) && !allowedRoles.includes(role)) {
				return NextResponse.redirect(new URL("/orders", req.url));
			}
		}
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
