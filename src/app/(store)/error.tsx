"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function StoreError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="p-4 bg-red-50 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div>
                <h2 className="font-bold text-gray-900 text-lg">Algo salió mal</h2>
                <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
                    Ocurrió un error inesperado. Podés intentar de nuevo.
                </p>
                {error.digest && (
                    <p className="text-xs font-mono text-gray-300 mt-1">ref: {error.digest}</p>
                )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                    onClick={reset}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors"
                >
                    Intentar de nuevo
                </button>
                <a
                    href="/"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                    Volver al catálogo
                </a>
            </div>
        </div>
    );
}
