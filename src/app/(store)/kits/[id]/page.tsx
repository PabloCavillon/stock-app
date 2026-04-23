import { getStoreKit } from "@/actions/store/kits.actions";
import { AddToCartControls } from "@/components/store/add-to-cart-controls";
import { ChevronLeft, Boxes, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const kit = await getStoreKit(id);
    if (!kit) return { title: "Kit no encontrado" };
    const description = kit.description
        ?? `Comprá el kit ${kit.name} en Projaska — tecnología y seguridad para profesionales.`;
    return {
        title: kit.name,
        description,
        openGraph: {
            title: kit.name,
            description,
            ...(kit.imageUrl && { images: [{ url: kit.imageUrl }] }),
        },
    };
}

export default async function KitDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const kit = await getStoreKit(id);
    if (!kit) notFound();

    const fmtArs = (n: number) =>
        n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: kit.name,
        description: kit.description ?? undefined,
        image: kit.imageUrl ?? undefined,
        sku: kit.sku,
        offers: {
            "@type": "Offer",
            priceCurrency: "ARS",
            price: kit.priceArs,
            availability: "https://schema.org/InStock",
        },
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Back */}
            <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors group"
            >
                <ChevronLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                Volver al catálogo
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {/* Image */}
                <div className="w-full aspect-square bg-violet-50 rounded-3xl flex items-center justify-center overflow-hidden relative border border-violet-100">
                    {kit.imageUrl ? (
                        <Image
                            src={kit.imageUrl}
                            alt={kit.name}
                            fill
                            className="object-contain p-6"
                            unoptimized
                        />
                    ) : (
                        <Boxes size={64} className="text-violet-200" />
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-5">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-600 text-white px-2.5 py-1 rounded-full">
                            Kit
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight mt-3">
                            {kit.name}
                        </h1>
                        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mt-1">#{kit.sku}</p>
                    </div>

                    {kit.description && (
                        <div className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                            {kit.description}
                        </div>
                    )}

                    {/* Kit contents */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            Incluye
                        </p>
                        <ul className="space-y-2">
                            {kit.items.map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                                        <Package size={12} className="text-gray-400" />
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium flex-1">
                                        {item.productName ?? item.childKitName}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded-lg">
                                        ×{item.quantity}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <p className="text-3xl font-black text-gray-900 leading-none">{fmtArs(kit.priceArs)}</p>
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
                            unit: "unit",
                            isOffer: false,
                        }}
                    />

                    <Link
                        href="/cart"
                        className="text-center text-sm text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        Ver carrito
                    </Link>
                </div>
            </div>
        </div>
    );
}
