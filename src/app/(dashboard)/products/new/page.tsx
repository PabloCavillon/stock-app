import { getPriceConfig } from "@/actions/config";
import { ProductForm } from "@/components/products/product-form";
import { ChevronLeft, PackagePlus } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: 'Nuevo producto',
}

export default async function NewProductPage() {
    const config = await getPriceConfig();
    return (
        <div className="max-w-3xl mx-auto p-4 md:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Navegación */}
            <header className="space-y-6">
                <Link
                    href="/products"
                    className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-colors gap-2 group"
                >
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Volver al Inventario
                </Link>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-100 rounded-[1.2rem] shrink-0">
                        <PackagePlus className="w-6 h-6 text-zinc-900" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-zinc-900">
                            Nuevo Producto
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1 font-light italic">
                            Registra un nuevo artículo en el sistema de stock.
                        </p>
                    </div>
                </div>
            </header>

            {/* Contenedor form */}
            <section className="bg-white p-6 md:p-12 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <ProductForm config={config} />
            </section>

            <footer className="text-center">
                <p className="text-xs text-zinc-400 uppercase tracking-[0.3em] font-medium">
                    Cuarzo Studio • Management System
                </p>
            </footer>
        </div>

    );
}