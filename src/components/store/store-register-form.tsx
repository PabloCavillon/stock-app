"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations/store-auth";
import { Loader2 } from "lucide-react";

const labelClass = "text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2 ml-1 block";
const inputClass = "w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-base sm:text-sm transition-all outline-none focus:ring-1 focus:ring-indigo-400 placeholder:text-zinc-300";

interface StoreRegisterFormProps {
    action: (data: RegisterFormData) => Promise<{ error: string } | { redirectTo: string }>;
}

export default function StoreRegisterForm({ action }: StoreRegisterFormProps) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null);
        try {
            const result = await action(data);
            if ("error" in result) {
                setServerError(result.error);
            } else {
                router.push(result.redirectTo);
            }
        } catch {
            setServerError("Ocurrió un error inesperado. Intentá de nuevo.");
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

            <div>
                <label className={labelClass} htmlFor="name">Nombre completo</label>
                <input id="name" type="text" autoComplete="name" className={inputClass} placeholder="Juan Pérez" {...register("name")} />
                {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name.message}</p>}
            </div>

            <div>
                <label className={labelClass} htmlFor="email">Email</label>
                <input id="email" type="email" autoComplete="email" className={inputClass} placeholder="tu@email.com" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div>
                <label className={labelClass} htmlFor="phone">
                    Teléfono <span className="normal-case font-normal text-zinc-300">(opcional)</span>
                </label>
                <input id="phone" type="tel" autoComplete="tel" className={inputClass} placeholder="+54 261 000-0000" {...register("phone")} />
            </div>

            <div>
                <label className={labelClass} htmlFor="password">Contraseña</label>
                <input id="password" type="password" autoComplete="new-password" className={inputClass} placeholder="Mínimo 8 caracteres" {...register("password")} />
                {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div>
                <label className={labelClass} htmlFor="confirmPassword">Confirmar contraseña</label>
                <input id="confirmPassword" type="password" autoComplete="new-password" className={inputClass} placeholder="Repetí tu contraseña" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword.message}</p>}
            </div>

            {serverError && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {serverError}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
            >
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Creando cuenta...</> : "Crear cuenta"}
            </button>
        </form>
    );
}
