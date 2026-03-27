'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomer, updateCustomer } from "@/actions/customers";
import { CustomerFormData, CustomerFormInput, customerSchema } from '@/lib/validations/customer';
import { Customer } from "@/generated/prisma/client";
import { Loader2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function CustomerForm({ customer }: { customer?: Customer }) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomerFormInput, unknown, CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: customer?.name ?? '',
            email: customer?.email ?? '',
            phone: customer?.phone ?? '',
            address: customer?.address ?? '',
        }
    });

    const onSubmit = async (data: CustomerFormData) => {
        setServerError(null);
        try {
            if (customer) await updateCustomer(customer.id, data);
            else await createCustomer(data);
            router.push("/customers");
            router.refresh();
        } catch {
            setServerError("Error al procesar el registro del cliente.");
        }
    };

    // --- ADN CUARZO STUDIO (COHERENCIA TOTAL) ---
    const labelClasses = "text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2 ml-1 block";
    const inputClasses = "w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm transition-all outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:bg-zinc-50 placeholder:text-zinc-300";
    const btnPrimary = "flex-1 md:flex-none inline-flex items-center justify-center px-10 py-3.5 rounded-xl text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-all active:scale-[0.98] gap-2 shadow-sm";
    const btnSecondary = "flex-1 md:flex-none inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-all gap-2";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col">
                <label className={labelClasses}>Nombre Completo / Razón Social</label>
                <input {...register("name")} placeholder="Juan Pérez o Projaska SRL" className={cn(inputClasses, errors.name && "border-red-200")} />
                {errors.name && <p className="text-xs text-red-500 mt-2 ml-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className={labelClasses}>Email</label>
                    <input {...register("email")} type="email" placeholder="cliente@correo.com" className={cn(inputClasses, errors.email && "border-red-200")} />
                    {errors.email && <p className="text-xs text-red-500 mt-2 ml-1">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col">
                    <label className={labelClasses}>Teléfono</label>
                    <input {...register("phone")} placeholder="+54 387 ..." className={cn(inputClasses, errors.phone && "border-red-200")} />
                    {errors.phone && <p className="text-xs text-red-500 mt-2 ml-1">{errors.phone.message}</p>}
                </div>
            </div>

            <div className="flex flex-col">
                <label className={labelClasses}>Dirección</label>
                <input {...register("address")} placeholder="Calle, Número, Localidad" className={inputClasses} />
            </div>

            {serverError && <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium animate-in fade-in">{serverError}</div>}

            <div className="flex flex-col-reverse md:flex-row gap-3 pt-8 border-t border-zinc-50">
                <button type="button" onClick={() => router.back()} className={btnSecondary}>
                    <X className="w-4 h-4" /> Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className={btnPrimary}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {customer ? "Actualizar Perfil" : "Registrar Cliente"}
                </button>
            </div>
        </form>
    );
}