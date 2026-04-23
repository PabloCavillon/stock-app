import { getStoreProducts } from "@/actions/store/products.actions";
import { getStoreKits } from "@/actions/store/kits.actions";
import { ProductCard } from "@/components/store/product-card";
import { KitCard } from "@/components/store/kit-card";
import { Boxes, Package, Settings } from "lucide-react";

export const metadata = { title: "Catálogo" };

export default async function StorePage() {
    const [{ products, config }, { kits }] = await Promise.all([
        getStoreProducts(),
        getStoreKits(),
    ]);

    if (!config) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Settings size={24} className="text-gray-400" />
                </div>
                <div>
                    <p className="font-semibold text-gray-900">Tienda no disponible</p>
                    <p className="text-sm text-gray-400 mt-1">El administrador debe configurar la cotización del dólar.</p>
                </div>
            </div>
        );
    }

    const categories = [...new Set(products.map((p) => p.category))].sort();

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Catálogo</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {products.length} productos · {kits.length} kits
                    </p>
                </div>
                <p className="text-xs text-gray-400 bg-white border border-gray-100 rounded-xl px-3 py-2 self-start sm:self-auto shadow-sm">
                    Precios en pesos argentinos
                </p>
            </div>

            {/* Kits & Offers */}
            {kits.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                            <Boxes size={13} className="text-violet-600" />
                        </div>
                        <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                            Kits & Ofertas
                            <span className="ml-1.5 text-gray-400 font-normal">({kits.length})</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {kits.map((kit) => (
                            <KitCard key={kit.id} kit={kit} />
                        ))}
                    </div>
                </section>
            )}

            {/* Products by category */}
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <Package size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No hay productos disponibles por el momento.</p>
                </div>
            ) : (
                categories.map((category) => {
                    const catProducts = products.filter((p) => p.category === category);
                    return (
                        <section key={category} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <Package size={12} className="text-indigo-500" />
                                </div>
                                <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                    {category}
                                    <span className="ml-1.5 text-gray-400 font-normal">({catProducts.length})</span>
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                                {catProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </section>
                    );
                })
            )}
        </div>
    );
}
