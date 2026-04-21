

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.STORE_JWT_SECRET);
const COOKIE_NAME = "store-token";
const EXPIRES_IN = "7d";

export type StoreSession = {
	id: string;
	name: string;
	email: string;
};

export async function createStoreSession(payload: StoreSession) {
	const token = await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime(EXPIRES_IN)
		.sign(SECRET);

	const cookieStore = await cookies();
	cookieStore.set(COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7,
		path: "/",
	});
}

export async function getStoreSession(): Promise<StoreSession | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value;
	if (!token) return null;

	try {
		const { payload } = await jwtVerify(token, SECRET);
		return payload as unknown as StoreSession;
	} catch {
		return null;
	}
}

export async function deleteStoreSession() {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_NAME);
}
