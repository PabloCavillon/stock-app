import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 1 * 60 * 60,
		updateAge: 12 * 60 * 60,
	},
	providers: [], // vacío, el middleware solo necesita verificar el JWT
	useSecureCookies: process.env.NODE_ENV === "production",
	cookies: {
		sessionToken: {
			name:
				process.env.NODE_ENV === "production"
					? `__Secure-next-auth.session-token`
					: `next-auth.session-token`,
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: process.env.NODE_ENV === "production",
			},
		},
	},
	callbacks: {
		jwt({ token, user }) {
			if (user) token.role = (user as any).role;
			return token;
		},
		session({ session, token }) {
			if (session.user) {
				session.user.role = token.role as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/admin/login",
	},
};
