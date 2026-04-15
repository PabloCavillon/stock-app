import { z } from "zod";

export const priceConfigSchema = z.object({
	dollarRate: z.coerce
		.number()
		.positive("La cotización debe ser mayor a 0"),
	shippingPct: z.coerce
		.number()
		.min(0, "No puede ser negativo")
		.max(100, "No puede superar 100%"),
	profitPct: z.coerce
		.number()
		.min(0, "No puede ser negativo")
		.max(100, "No puede superar 100%"),
	guildDiscountPct: z.coerce
		.number()
		.min(0, "No puede ser negativo")
		.max(100, "No puede superar 100%"),
	volumeDiscountPct: z.coerce
		.number()
		.min(0, "No puede ser negativo")
		.max(100, "No puede superar 100%"),
	volumeThresholdArs: z.coerce
		.number()
		.positive("El umbral debe ser mayor a 0"),
});

export type PriceConfigFormInput = z.input<typeof priceConfigSchema>;
export type PriceConfigFormData = z.output<typeof priceConfigSchema>;
