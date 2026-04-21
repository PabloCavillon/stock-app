import { getStoreProduct } from "@/actions/store/products.actions";
import { ProductDetailClient } from "@/components/store/product-detail-client";
import { Package } from "lucide-react";
import Image from "next/image";
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
        <div className="max-w-4xl mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {/* Imagen */}
                <div className="w-full aspect-square bg-white rounded-3xl flex items-center justify-center overflow-hidden relative border border-gray-200 md:mt-8">
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

                {/* Info + controles (client) — incluye botón volver */}
                <ProductDetailClient product={product} />
            </div>
        </div>
    );
}
