import { getStoreProduct } from "@/actions/store/products.actions";
import { ProductDetailClient } from "@/components/store/product-detail-client";
import { Package } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getStoreProduct(id);
    if (!product) return { title: "Producto no encontrado" };
    const description = product.description
        ?? `Comprá ${product.name} en Projaska — tecnología y seguridad para profesionales.`;
    return {
        title: product.name,
        description,
        openGraph: {
            title: product.name,
            description,
            ...(product.imageUrl && { images: [{ url: product.imageUrl }] }),
        },
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getStoreProduct(id);
    if (!product) notFound();

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        description: product.description ?? undefined,
        image: product.imageUrl ?? undefined,
        sku: product.sku,
        offers: {
            "@type": "Offer",
            priceCurrency: "ARS",
            price: product.priceArs,
            availability: product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
        },
    };

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {/* Imagen */}
                <div className="w-full aspect-square bg-gray-50 rounded-3xl flex items-center justify-center overflow-hidden relative border border-gray-100 md:mt-8">
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
