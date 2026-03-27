import Link from "next/link"
import clsx from "clsx"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Product = {
    id: string
    name: string
    sku: string
    stock: number
}

export function LowStockTable({ products }: { products: Product[] }) {
    if (products.length === 0) return null

    const thClasses = "px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-left";

    return (
        <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
            {/* Header de la Métrica */}
            <div className="px-6 py-5 border-b border-zinc-50 bg-amber-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
                            Alertas de Stock
                        </h2>
                        <p className="text-[10px] font-bold text-amber-600/80 uppercase tracking-widest">
                            Nivel crítico detectado
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabla de Productos con Bajo Stock */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-50">
                            <th className={thClasses}>Producto</th>
                            <th className={thClasses}>SKU</th>
                            <th className={thClasses}>Estado Actual</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {products.map((p) => (
                            <tr key={p.id} className="group hover:bg-zinc-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-zinc-900">
                                    {p.name}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-tighter bg-zinc-100/50 px-2 py-1 rounded">
                                        #{p.sku}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                        p.stock === 0
                                            ? "bg-red-50 text-red-700 border-red-100"
                                            : "bg-amber-50 text-amber-700 border-amber-100"
                                    )}>
                                        {p.stock === 0 ? "Sin Stock" : `${p.stock} Unidades`}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href="/stock"
                                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors group/link"
                                    >
                                        Ajustar
                                        <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}