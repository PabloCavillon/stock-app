'use client'

import { createCustomer, updateCustomer } from "@/actions/customers";
import { Customer } from "@/generated/prisma/client";
import { CustomerFormData, CustomerFormInput, customerSchema } from "@/lib/validations/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { custom } from "zod";

export function CustomerForm({ customer }: { customer?: Customer }) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors, isSubmitting }, } =
        useForm<CustomerFormInput, unknown, CustomerFormData>({
            resolver: zodResolver(customerSchema),
            defaultValues: {
                name: customer?.name ?? '',
                email: customer?.email ?? '',
                phone: customer?.phone ?? '',
                address: customer?.address ?? '',
                notes: customer?.notes ?? ''
            }
        });

    const onSubmit = async (data: CustomerFormData) => {
        setServerError(null);
        try {
            if (customer) {
                await updateCustomer(customer.id, data);
            } else {
                await createCustomer(data);
            }
            router.push('/customers');
            router.refresh();
        } catch {
            setServerError('Algo fue mal, por favor intenta de nuevo.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-lg">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                    {...register("name")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                    Email <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                    {...register("email")}
                    type="email"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                    Phone <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                    {...register("phone")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                    Address <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                    {...register("address")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                    Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                    {...register("notes")}
                    rows={3}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
            </div>

            {serverError && <p className="text-sm text-red-500">{serverError}</p>}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? "Saving..." : customer ? "Save changes" : "Create customer"}
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