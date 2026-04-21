"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/store-auth";
import { Loader2 } from "lucide-react";

const labelClass = "text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2 ml-1 block";
const inputClass = "w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-base sm:text-sm transition-all outline-none focus:ring-1 focus:ring-indigo-400 placeholder:text-zinc-300";

interface StoreLoginFormProps {
    action: (data: LoginFormData) => Promise<{ error: string } | { redirectTo: string }>;
    redirectTo?: string;
}

export default function StoreLoginForm({ action, redirectTo }: StoreLoginFormProps) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "", redirect: redirectTo },
    });

    const onSubmit = async (data: LoginFormData) => {
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
            <input type="hidden" {...register("redirect")} />

            <div>
                <label className={labelClass} htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    placeholder="tu@email.com"
                    {...register("email")}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div>
                <label className={labelClass} htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className={inputClass}
                    placeholder="••••••••"
                    {...register("password")}
                />
                {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
            </div>

            {serverError && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {serverError}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none cursor-pointer text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
            >
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Ingresando...</> : "Ingresar"}
            </button>
        </form>
    );
}
