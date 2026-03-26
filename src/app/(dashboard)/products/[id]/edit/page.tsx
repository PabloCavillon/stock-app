import { getProduct } from "@/actions/products";
import { ProductForm } from "@/components/products/product-form";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) notFound();

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
            <header className="space-y-4">
                <Link
                    href="/products"
                    className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors gap-1 group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Volver a productos
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Editar Producto</h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Actualizando: <span className="font-medium text-zinc-900">{product.name}</span> (SKU: {product.sku})
                    </p>
                </div>
            </header>

            <section className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                <ProductForm product={product} />
            </section>
        </div>
    );
}