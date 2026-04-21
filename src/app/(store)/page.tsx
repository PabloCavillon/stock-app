import { getStoreProducts } from "@/actions/products.actions";
import { getStoreKits } from "@/actions/kits.actions";
import { ProductCard } from "@/components/store/product-card";
import { KitCard } from "@/components/store/kit-card";
import { Boxes, Package, Settings } from "lucide-react";

export const metadata = { title: "Catálogo | Projaska" };

export default async function StorePage() {
    const [{ products, config }, { kits }] = await Promise.all([
        getStoreProducts(),
        getStoreKits(),
    ]);

    if (!config) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                <Settings size={40} className="text-gray-300" />
                <p className="text-gray-500 font-medium">La tienda no está disponible en este momento.</p>
                <p className="text-sm text-gray-400">El administrador debe configurar la cotización del dólar.</p>
            </div>
        );
    }

    const categories = [...new Set(products.map((p) => p.category))].sort();

    return (
        <div className="space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Catálogo</h1>
                <p className="text-sm text-gray-400 mt-1">
                    {products.length} productos · {kits.length} kits · Precios en pesos argentinos
                </p>
            </div>

            {/* ── Kits & Ofertas ── */}
            {kits.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Boxes size={15} className="text-violet-500" />
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            Kits & Ofertas <span className="text-gray-400 font-normal">({kits.length})</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {kits.map((kit) => (
                            <KitCard key={kit.id} kit={kit} />
                        ))}
                    </div>
                </section>
            )}

            {/* ── Productos por categoría ── */}
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                    <Package size={40} className="text-gray-300" />
                    <p className="text-gray-500 font-medium">No hay productos disponibles por el momento.</p>
                </div>
            ) : (
                categories.map((category) => {
                    const catProducts = products.filter((p) => p.category === category);
                    return (
                        <section key={category} className="space-y-4">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">
                                {category} <span className="text-gray-400 font-normal">({catProducts.length})</span>
                            </h2>
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
