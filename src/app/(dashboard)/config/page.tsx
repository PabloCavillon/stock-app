import { getPriceConfig } from "@/actions/config";
import { PriceConfigForm } from "@/components/config/price-config-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";

export const metadata = {
    title: "Configuración",
};

export default async function ConfigPage() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") redirect("/");

    const config = await getPriceConfig();
    if (!config) {
        return (
            <div className="max-w-3xl mx-auto p-4 md:p-10">
                <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-sm font-medium">
                    No hay configuración de precios. Corré el seed para crear la inicial:{" "}
                    <code className="font-mono bg-amber-100 px-1 rounded">npm run seed</code>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-700">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 rounded-xl shrink-0">
                        <Settings className="w-5 h-5 text-zinc-900" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-zinc-900">
                        Configuración
                    </h1>
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
                    Cotización, markups y descuentos
                </p>
            </header>

            <PriceConfigForm config={config} />
        </div>
    );
}
