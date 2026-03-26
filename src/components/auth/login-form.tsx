'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
// Si no usas lucide-react, puedes omitir el icono o usar un span
import { Loader2 } from "lucide-react";

/**
 * LoginForm Component
 * Design: Minimalist Premium
 * Language: Code in English / UI in Spanish
 */
export default function LoginForm() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);
		const username = formData.get("username");
		const password = formData.get("password");

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
			setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
			setIsLoading(false);
		}
	};

	// Shared Tailwind classes for minimalism
	const inputStyles = "w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:bg-zinc-50 disabled:text-zinc-400";
	const labelStyles = "text-xs font-medium text-zinc-500 mb-1.5 ml-1 uppercase tracking-wider";

	return (
		<div className="w-full max-w-[400px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-8 md:p-10">
			{/* Brand / Logo Section */}
			<header className="mb-8">
				<h1 className="text-2xl font-bold tracking-tighter text-zinc-900">
					Stock App
				</h1>
				<p className="text-sm text-zinc-500 mt-1">
					Ingresa tus datos para continuar.
				</p>
			</header>

			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				{/* Username Field */}
				<div className="flex flex-col">
					<label htmlFor="username" className={labelStyles}>
						Usuario
					</label>
					<input
						id="username"
						name="username"
						type="text"
						required
						placeholder="nombre@ejemplo.com"
						autoComplete="username"
						disabled={isLoading}
						className={inputStyles}
					/>
				</div>

				{/* Password Field */}
				<div className="flex flex-col">
					<label htmlFor="password" className={labelStyles}>
						Contraseña
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						placeholder="••••••••"
						autoComplete="current-password"
						disabled={isLoading}
						className={inputStyles}
					/>
				</div>

				{/* Error Message */}
				{error && (
					<div className="animate-in fade-in slide-in-from-top-1">
						<p className="text-xs font-medium text-red-500 bg-red-50 border border-red-100 rounded-md p-3 text-center">
							{error}
						</p>
					</div>
				)}

				{/* Submit Button */}
				<button
					type="submit"
					disabled={isLoading}
					className="mt-2 w-full bg-zinc-900 text-white rounded-lg px-4 py-3 text-sm font-semibold hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-2"
				>
					{isLoading ? (
						<>
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Verificando...</span>
						</>
					) : (
						"Iniciar Sesión"
					)}
				</button>
			</form>

			{/* Footer Info */}
			<footer className="mt-8 pt-6 border-t border-zinc-50 text-center">
				<p className="text-xs text-zinc-400">
					&copy; {new Date().getFullYear()} Cuarzo Studio
				</p>
			</footer>
		</div>
	);
}