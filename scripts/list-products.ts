import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env.production" });

const main = async () => {
	const { prisma } = await import("@/lib/prisma");
	const products = await prisma.product.findMany({
		where: { deletedAt: null },
		select: { name: true },
		orderBy: { name: "asc" },
	});
	console.log(`\n${products.length} productos encontrados:\n`);
	products.forEach((p, i) => console.log(`${i + 1}. ${p.name}`));
	await prisma.$disconnect();
};

main().catch(console.error);
