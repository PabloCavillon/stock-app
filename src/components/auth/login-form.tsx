'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";

export default function LoginForm() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);
		const username = formData.get("username") as string;
		const password = formData.get("password") as string;

		try {
			const result = await signIn("credentials", {
				username,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError("Usuario o contraseña incorrectos");
				setIsLoading(false);
				return;
			}

			router.push("/orders");
			router.refresh();
		} catch (err) {
			setError("Error de conexión. Inténtalo de nuevo.");
			setIsLoading(false);
		}
	};

	// --- Sistema de Diseño Unificado (Coherencia Cuarzo) ---
	const labelClasses = "text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2 ml-1 block";
	const inputClasses = "w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm transition-all outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:bg-zinc-50 placeholder:text-zinc-300";
	const buttonClasses = "w-full bg-zinc-900 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm";

	return (
		<div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
			{/* Header */}
			<header className="mb-10 text-center">
				<h1 className="text-3xl font-extrabold tracking-tighter text-zinc-900">
					Stock App
				</h1>
				<p className="text-sm text-zinc-400 mt-2 font-light">
					Ingresa tus credenciales
				</p>
			</header>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Username */}
				<div className="flex flex-col">
					<label htmlFor="username" className={labelClasses}>Usuario</label>
					<input
						id="username"
						name="username"
						type="text"
						required
						autoComplete="username"
						placeholder="Nombre de usuario"
						disabled={isLoading}
						className={inputClasses}
					/>
				</div>

				{/* Password */}
				<div className="flex flex-col">
					<div className="flex justify-between items-end mb-2 px-1">
						<label htmlFor="password" className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
							Contraseña
						</label>
					</div>
					<input
						id="password"
						name="password"
						type="password"
						required
						autoComplete="current-password"
						placeholder="••••••••"
						disabled={isLoading}
						className={inputClasses}
					/>
				</div>

				{/* Error Feedback */}
				{error && (
					<div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-medium text-center animate-in fade-in zoom-in-95">
						{error}
					</div>
				)}

				{/* Submit */}
				<button type="submit" disabled={isLoading} className={buttonClasses}>
					{isLoading ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						<>
							Entrar
							<ArrowRight className="w-4 h-4" />
						</>
					)}
				</button>
			</form>

			{/* Footer Branding */}
			<footer className="mt-10 pt-6 border-t border-zinc-50 text-center">
				<p className="text-[10px] text-zinc-300 uppercase tracking-widest font-medium">
					Cuarzo Studio
				</p>
			</footer>
		</div>
	);
}