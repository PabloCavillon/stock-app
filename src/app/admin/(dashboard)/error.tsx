"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="p-4 bg-red-50 rounded-2xl mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
                Algo salió mal
            </h1>
            <p className="text-sm text-zinc-400 mt-2 max-w-sm">
                Ocurrió un error inesperado en esta sección.
            </p>
            {error.digest && (
                <p className="text-xs font-mono text-zinc-300 mt-1">ref: {error.digest}</p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Intentar de nuevo
                </button>
                <button
                    onClick={() => router.push("/")}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 text-sm font-bold hover:bg-zinc-100 transition-colors"
                >
                    <Home className="w-4 h-4" />
                    Ir al dashboard
                </button>
            </div>
        </div>
    );
}
