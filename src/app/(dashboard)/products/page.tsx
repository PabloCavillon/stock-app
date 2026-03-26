import { getProducts } from "@/actions/products";
import ProductsTable from "@/components/products/products-table";
import Link from "next/link";
import { Plus, Package } from "lucide-react"; // Importamos Package para un toque visual extra

/**
 * Products Main Directory
 * Design: High-end Dashboard
 * Language: English logic / Spanish UI
 */
export default async function ProductsPage() {
  const products = await getProducts();
  const hasProducts = products.length > 0;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-700">

      {/* Header Section: Decisiones de diseño para jerarquía clara */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zinc-100 rounded-lg">
              <Package className="w-5 h-5 text-zinc-900" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Inventario
            </h1>
          </div>
          <p className="text-sm text-zinc-500 max-w-prose">
            Visualiza y gestiona el stock de tus productos.
            Actualmente cuentas con <span className="font-semibold text-zinc-900">{products.length} artículos</span> registrados.
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center justify-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-sm shadow-zinc-200"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Link>
      </header>

      {/* Table Section con micro-interacción de entrada */}
      <div className={hasProducts ? "block" : "min-h-100 flex items-center justify-center border-2 border-dashed border-zinc-100 rounded-3xl"}>
        {hasProducts ? (
          <ProductsTable products={products} />
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-zinc-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 text-zinc-300" />
            </div>
            <div>
              <h3 className="text-zinc-900 font-medium">No hay productos aún</h3>
              <p className="text-zinc-400 text-sm mt-1">Comienza agregando tu primer artículo al inventario.</p>
            </div>
            <Link
              href="/products/new"
              className="inline-block text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition-colors"
            >
              Crear primer producto
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}