import { getStoreProduct } from "@/actions/store/products.actions";
import { AddToCartControls } from "@/components/store/add-to-cart-controls";
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

    const fmtArs = (n: number) =>
        n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

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

                {/* Info */}
                <div className="flex flex-col gap-5">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-full">
                                {product.category}
                            </span>
                            {product.stock > 0 ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    {product.stock} en stock
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    Sin stock
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">#{product.sku}</p>
                    </div>

                    {/* Descripción */}
                    {product.description && (
                        <div className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                            {product.description}
                        </div>
                    )}

                    {/* Precio */}
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                        <p className="text-3xl font-black text-gray-900">{fmtArs(product.priceArs)}</p>
                    </div>

                    {/* Controles de carrito */}
                    <AddToCartControls
                        item={{
                            cartKey: `product:${product.id}`,
                            type: "product",
                            id: product.id,
                            name: product.name,
                            sku: product.sku,
                            priceUsd: product.priceUsd,
                            imageUrl: product.imageUrl,
                        }}
                        outOfStock={product.stock === 0}
                    />

                    <Link
                        href="/store/cart"
                        className="text-center text-sm text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        Ver carrito
                    </Link>
                </div>
            </div>
        </div>
    );
}
