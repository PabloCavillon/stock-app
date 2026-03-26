'use client'

import { Customer } from "@/generated/prisma/client"
import { SerializedProduct } from "@/types/product"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { OrderFormInput, OrderFormData, orderSchema } from '../../lib/validations/order';
import { zodResolver } from "@hookform/resolvers/zod"
import { createOrder } from "@/actions/orders"

export function OrderForm({
    products,
    customers
}: {
    products: SerializedProduct[],
    customers: Customer[]
}) {

    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<OrderFormInput, unknown, OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            customerId: '',
            notes: '',
            items: [{ productId: '', quantity: 1, unitPrice: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'items' })

    const watchedItems = watch('items')

    const total = watchedItems.reduce((acc, item) => {
        return acc + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0)
    }, 0)

    const handleProductChange = (index: number, productId: string) => {
        const product = products.find(p => p.id === productId)
        if (product) {
            setValue(`items.${index}.unitPrice`, product.price)
        }
    }

    const onSubmit = async (data: OrderFormData) => {
        setServerError(null)
        try {
            await createOrder(data)
            router.push("/orders")
            router.refresh();
        } catch {
            setServerError('Algo salió mal. Por favor intenta de nuevo.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">

            {/* Customer */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Customer</label>
                <select
                    {...register("customerId")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                >
                    <option value="">Select a customer...</option>
                    {customers.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {errors.customerId && <p className="text-xs text-red-500">{errors.customerId.message}</p>}
            </div>

            {/* Items */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Products</label>
                    <button
                        type="button"
                        onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        + Add product
                    </button>
                </div>

                {errors.items?.root && (
                    <p className="text-xs text-red-500">{errors.items.root.message}</p>
                )}

                <div className="flex flex-col gap-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                            {/* Product select */}
                            <div className="col-span-6">
                                <select
                                    {...register(`items.${index}.productId`)}
                                    onChange={(e) => {
                                        register(`items.${index}.productId`).onChange(e)
                                        handleProductChange(index, e.target.value)
                                    }}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                >
                                    <option value="">Select product...</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} (stock: {p.stock})
                                        </option>
                                    ))}
                                </select>
                                {errors.items?.[index]?.productId && (
                                    <p className="text-xs text-red-500 mt-0.5">{errors.items[index].productId?.message}</p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="col-span-2">
                                <input
                                    {...register(`items.${index}.quantity`)}
                                    type="number"
                                    min="1"
                                    placeholder="Qty"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
                                />
                            </div>

                            {/* Unit price */}
                            <div className="col-span-3">
                                <input
                                    {...register(`items.${index}.unitPrice`)}
                                    type="number"
                                    step="0.01"
                                    placeholder="Price"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
                                />
                            </div>

                            {/* Remove */}
                            <div className="col-span-1 flex justify-center pt-2">
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                    Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                    {...register("notes")}
                    rows={2}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-700">Total</span>
                <span className="text-lg font-semibold text-gray-900">${total.toFixed(2)}</span>
            </div>

            {serverError && <p className="text-sm text-red-500">{serverError}</p>}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? "Creating..." : "Create order"}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}