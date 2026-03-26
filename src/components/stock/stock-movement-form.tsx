'use client';

import { createStockMovement } from "@/actions/stock";
import { StockMovementFormData, StockMovementFormInput, stockMovementSchema } from "@/lib/validations/stock";
import { SerializedProduct } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function StockMovementForm({ products }: { products: SerializedProduct[] }) {

    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<StockMovementFormInput, unknown, StockMovementFormData>({
        resolver: zodResolver(stockMovementSchema),
        defaultValues: {
            productId: '',
            type: 'IN',
            quantity: 1,
            reason: ''
        }
    });

    const onSubmit = async (data: StockMovementFormData) => {
        setServerError(null);
        setSuccess(false);
        try {
            await createStockMovement(data)
            reset()
            setSuccess(true)
            router.refresh()
        } catch {
            setServerError("Algo salió mal. Por favor intente de nuevo.")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Product</label>
                <select
                    {...register("productId")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name} (stock: {p.stock})
                        </option>
                    ))}
                </select>
                {errors.productId && <p className="text-xs text-red-500">{errors.productId.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                    {...register("type")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                    <option value="IN">IN — Stock entry</option>
                    <option value="OUT">OUT — Stock exit</option>
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <input
                    {...register("quantity")}
                    type="number"
                    min="1"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
                />
                {errors.quantity && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                    Reason <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                    {...register("reason")}
                    placeholder="e.g. Purchase, Loss, Adjustment..."
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
                />
            </div>

            {serverError && <p className="text-sm text-red-500">{serverError}</p>}
            {success && <p className="text-sm text-green-600">Movement registered successfully.</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
                {isSubmitting ? "Saving..." : "Register movement"}
            </button>
        </form>
    )
}