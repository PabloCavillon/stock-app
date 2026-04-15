// Las variables de entorno deben cargarse ANTES de que se importe prisma
// porque PrismaNeon se inicializa en el momento del import.
// Por eso usamos dynamic import después de configurar dotenv.
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env.production" });

const main = async () => {
	// Dynamic imports: se ejecutan DESPUÉS de que dotenv ya cargó las vars
	const { hash } = await import("bcryptjs");
	const { prisma } = await import("@/lib/prisma");

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

	// Configuración de precios inicial (singleton)
	const existingConfig = await prisma.priceConfig.findFirst();
	if (!existingConfig) {
		await prisma.priceConfig.create({
			data: {
				dollarRate: 1200,            // ARS por USD — actualizar con cotización real
				shippingPct: 5,              // 5% cobertura envío BsAs → Salta
				profitPct: 20,               // 20% de ganancia
				guildDiscountPct: 10,        // 10% descuento gremio
				volumeDiscountPct: 10,       // 10% descuento por volumen
				volumeThresholdArs: 1000000, // $1.000.000 ARS
			},
		});
		console.log("PriceConfig inicial creada");
	} else {
		console.log("PriceConfig ya existe, se omite");
	}

	await prisma.$disconnect();
};

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
