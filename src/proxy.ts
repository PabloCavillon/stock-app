import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import { jwtVerify } from "jose";

const { auth } = NextAuth(authConfig);

const STORE_JWT_SECRET = new TextEncoder().encode(process.env.STORE_JWT_SECRET);
const STORE_COOKIE_NAME = "store-token";

const ROLE_ROUTES: Record<string, string[]> = {
	"/products": ["ADMIN", "SELLER"],
	"/customers": ["ADMIN", "SELLER"],
	"/stock": ["ADMIN", "WAREHOUSE"],
	"/users": ["ADMIN"],
	"/orders": ["ADMIN", "SELLER", "WAREHOUSE"],
};

const STORE_PROTECTED_ROUTES = [
	"/store/orders",
	"/store/checkout",
	"/store/cart",
];

const ADMIN_LOGIN_PAGE = "/admin/login";
const STORE_LOGIN_PAGE = "/store/login";
const STORE_PREFIX = "/store";

async function verifyStoreToken(token: string): Promise<boolean> {
	try {
		await jwtVerify(token, STORE_JWT_SECRET);
		return true;
	} catch {
		return false;
	}
}

export default auth(async (req) => {
	const { pathname } = req.nextUrl;

	// ─── STORE ────────────────────────────────────────────────────────────────
	if (pathname.startsWith(STORE_PREFIX)) {
		const isProtectedRoute = STORE_PROTECTED_ROUTES.some((route) =>
			pathname.startsWith(route),
		);

		if (isProtectedRoute) {
			const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
			const isAuthenticated = token
				? await verifyStoreToken(token)
				: false;

			if (!isAuthenticated) {
				const redirectUrl = new URL(
					STORE_LOGIN_PAGE,
					req.nextUrl.origin,
				);
				redirectUrl.searchParams.set("redirect", pathname);
				return NextResponse.redirect(redirectUrl);
			}
		}

		return NextResponse.next();
	}

	// ─── ADMIN PANEL ──────────────────────────────────────────────────────────
	const isLoggedIn = !!req.auth;
	const isLoginPage = pathname === ADMIN_LOGIN_PAGE;

	if (!isLoggedIn && !isLoginPage) {
		return NextResponse.redirect(
			new URL(ADMIN_LOGIN_PAGE, req.nextUrl.origin),
		);
	}

	if (isLoggedIn && isLoginPage) {
		const role = (req.auth?.user as any)?.role ?? "SELLER";
		const defaultRoute = role === "WAREHOUSE" ? "/stock" : "/orders";
		return NextResponse.redirect(new URL(defaultRoute, req.nextUrl.origin));
	}

	if (isLoggedIn) {
		const role = (req.auth?.user as any)?.role;

		for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
			if (pathname.startsWith(route)) {
				if (!role || !allowedRoles.includes(role)) {
					return NextResponse.redirect(
						new URL("/", req.nextUrl.origin),
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
