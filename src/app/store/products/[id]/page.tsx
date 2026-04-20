import { getStoreProduct } from "@/actions/store/products.actions";
import { ProductDetailClient } from "@/components/store/product-detail-client";
import { ChevronLeft, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getStoreProduct(id);
    return { title: product ? `${product.name} | Projaska` : "Producto no encontrado" };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getStoreProduct(id);
    if (!product) notFound();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back */}
            <Link
                href="/store"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors group"
            >
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Volver al catálogo
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {/* Imagen */}
                <div className="w-full aspect-square bg-[#f5f5f5] rounded-3xl flex items-center justify-center overflow-hidden relative border border-gray-200">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain p-6"
                            unoptimized
                        />
                    ) : (
                        <Package size={64} className="text-gray-200" />
                    )}
                </div>

                {/* Info + controles (client) */}
                <ProductDetailClient product={product} />
            </div>
        </div>
    );
}
