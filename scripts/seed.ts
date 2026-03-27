import "dotenv/config";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const main = async () => {
	const password = await hash("admin123", 12);

	await prisma.user.upsert({
		where: { username: "admin" },
		update: {},
		create: {
			username: "admin",
			password,
			role: "ADMIN",
		},
	});

	console.log("Admin user created successfully");
};

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
