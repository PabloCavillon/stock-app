import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env.production" });

const images: { name: string; imageUrl: string }[] = [
	{ name: "BALUN G909 a Presión x 2 Unidades", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/5734353697526656744_0" },
	{ name: "Bobina Cable UTP 4 PARES 305mts CAT5e Exterior", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/13762182971894374572_0" },
	{ name: "Cable HDMI 1.5 metros", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/4802370870757700523_0" },
	{ name: "Cable UTP 2 pares x metro", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/15780013357219840020_0" },
	{ name: "Cable UTP 4 pares x metro", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/3560338769380676988_0" },
	{ name: "Cable de red UTP de 1.5 metros", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/2857552069405416182_0" },
	{ name: "Caja de DVR Dahua 4 ch up to 1080p", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/4980708767469292032_0" },
	{ name: "Caja de DVR Dahua 8 ch up to1080p", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/6818992741589230804_0" },
	{ name: "Cámara 2 MP Dahua IP67 DH-HAC-B1A21P-U-0280B", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/5779150501949680065_0" },
	{ name: "Cámara Bullet 2 MP Dahua DH-HAC-HFW1200CLP-IL-A0280B-S6", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/1083171956710746832_0" },
	{ name: "Cámara Bullet CYGNUS 5MP Fullcolor", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/7097707779791891348_0" },
	{ name: "Cámara Domo CYGNUS 5MP Fullcolor", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/4492770963318766955_0" },
	{ name: "Cámara IMOU CUE 2 MP", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/10233986221133435347_0" },
	{ name: "Cámaras Domo 2 MP Dahua DH-HAC-T1A21P-U-0280B", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/10366146754686825506_0" },
	{ name: "Fuente 3 AMP", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/3825022221140473618_0" },
	{ name: "Memoria 64 GB", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/13902863537952384419_0" },
	{ name: "PLUG Hembra", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/5209155532067371694_0" },
	{ name: "PLUG Macho", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/11448954767909542000_0" },
	{ name: "Splitter Pulpo de alimentación de 1 a 4", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/4578154569502667300_0" },
	{ name: "Splitter Pulpo de alimentación de 1 a 8", imageUrl: "http://googleusercontent.com/image_collection/image_retrieval/6363366984188572016_0" },
];

const main = async () => {
	const { prisma } = await import("@/lib/prisma");

	let updated = 0;
	let notFound = 0;

	for (const { name, imageUrl } of images) {
		const result = await prisma.product.updateMany({
			where: { name, deletedAt: null },
			data: { imageUrl },
		});
		if (result.count > 0) {
			console.log(`✓ ${name}`);
			updated++;
		} else {
			console.log(`✗ No encontrado: ${name}`);
			notFound++;
		}
	}

	console.log(`\n${updated} actualizados, ${notFound} no encontrados.`);
	await prisma.$disconnect();
};

main().catch(console.error);
