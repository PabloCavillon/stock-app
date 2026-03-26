import z from "zod";

export const customerSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email").optional().or(z.literal("")),
	phone: z.string().optional(),
	address: z.string().optional(),
	notes: z.string().optional(),
});

export type CustomerFormInput = z.input<typeof customerSchema>;
export type CustomerFormData = z.output<typeof customerSchema>;