import { getStoreKit } from "@/actions/store/kits.actions";
import { AddToCartControls } from "@/components/store/add-to-cart-controls";
import { ChevronLeft, Boxes, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const kit = await getStoreKit(id);
    return { title: kit ? `${kit.name} | Projaska` : "Kit no encontrado" };
}

export default async function KitDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const kit = await getStoreKit(id);
    if (!kit) notFound();

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
                <div className="w-full aspect-square bg-gray-50 rounded-3xl flex items-center justify-center overflow-hidden relative border border-gray-100">
                    {kit.imageUrl ? (
                        <Image
                            src={kit.imageUrl}
                            alt={kit.name}
                            fill
                            className="object-contain p-6"
                            unoptimized
                        />
                    ) : (
                        <Boxes size={64} className="text-gray-200" />
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-5">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full">
                                Kit
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                            {kit.name}
                        </h1>
                        <p className="text-xs font-mono text-gray-300 uppercase tracking-widest">#{kit.sku}</p>
                    </div>

                    {/* Descripción */}
                    {kit.description && (
                        <div className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                            {kit.description}
                        </div>
                    )}

                    {/* Contenido del kit */}
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Incluye
                        </p>
                        <ul className="space-y-2">
                            {kit.items.map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                                        <Package size={13} className="text-gray-400" />
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium flex-1">
                                        {item.productName ?? item.childKitName}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-lg">
                                        ×{item.quantity}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Precio */}
                    <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 space-y-1">
                        <p className="text-3xl font-black text-gray-900">{fmtArs(kit.priceArs)}</p>
                        <p className="text-sm text-gray-400">
                            USD {kit.priceUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })} · precio de referencia
                        </p>
                    </div>

                    {/* Controles de carrito */}
                    <AddToCartControls
                        item={{
                            cartKey: `kit:${kit.id}`,
                            type: "kit",
                            id: kit.id,
                            name: kit.name,
                            sku: kit.sku,
                            priceUsd: kit.priceUsd,
                            imageUrl: kit.imageUrl,
                        }}
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
