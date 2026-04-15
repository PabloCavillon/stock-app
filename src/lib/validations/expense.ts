import { z } from "zod";

export const expenseSchema = z
    .object({
        type: z.enum(["PURCHASE", "SHIPPING", "OTHER"]),
        description: z.string().min(1, "La descripción es requerida"),
        amountUsd: z.coerce.number().positive().optional(),
        amountArs: z.coerce.number().positive().optional(),
        dollarRate: z.coerce.number().positive().optional(),
        date: z.string().min(1, "La fecha es requerida"),
        notes: z.string().optional(),
    })
    .refine(
        (d) => {
            if (d.type === "PURCHASE") return d.amountUsd !== undefined && d.amountUsd > 0;
            return d.amountArs !== undefined && d.amountArs > 0;
        },
        { message: "Ingresá el monto correspondiente al tipo de gasto" },
    );

export type ExpenseFormInput = z.input<typeof expenseSchema>;
export type ExpenseFormData = z.output<typeof expenseSchema>;
