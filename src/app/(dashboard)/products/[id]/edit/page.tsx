import { getProduct } from "@/actions/products";
import { ProductForm } from "@/components/products/product-form";
import { notFound } from "next/navigation";
import { ChevronLeft, Edit3 } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: 'Producto',
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) notFound();

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-10 animate-in fade-in duration-500">

            {/* Navegación y Header */}
            <header className="space-y-6">
                <Link
                    href="/products"
                    className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors gap-2 group"
                >
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Volver al Inventario
                </Link>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 rounded-[1.2rem]">
                        <Edit3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900">
                            Editar Producto
                        </h1>
                        <p className="text-sm text-zinc-400 mt-1 font-light italic">
                            Modificando: <span className="text-zinc-900 font-medium not-italic">{product.name}</span>
                        </p>
                    </div>
                </div>
            </header>

            {/* Contenedor Unificado */}
            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <ProductForm product={product} />
            </section>
        </div>
    );
}