import { z } from "zod";

export const productSchema = z.object({
	sku: z.string().min(1, "SKU is required"),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
	price: z.coerce.number().positive("Price must be greater than 0"),
	stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
	category: z.string().min(1, "Category is required"),
});

export type ProductFormInput = z.input<typeof productSchema>
export type ProductFormData = z.output<typeof productSchema>