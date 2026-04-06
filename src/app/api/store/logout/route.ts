import { deleteStoreSession } from "@/lib/store-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	await deleteStoreSession();
	const origin = new URL(req.url).origin;
	return NextResponse.redirect(`${origin}/store/login`);
}
