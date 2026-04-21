import Link from "next/link"
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

    const thClasses = "px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] text-left";

    return (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-100 bg-amber-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-xl text-amber-600 shrink-0">
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Alertas de Stock</h2>
                        <p className="text-xs font-bold text-amber-600/80 uppercase tracking-widest">Nivel crítico detectado</p>
                    </div>
                </div>
            </div>

            {/* DESKTOP */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-100">
                            <th className={thClasses}>Producto</th>
                            <th className={thClasses}>SKU</th>
                            <th className={thClasses}>Estado Actual</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {products.map((p) => (
                            <tr key={p.id} className="group hover:bg-zinc-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-base text-zinc-900">{p.name}</td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-xs text-zinc-400 uppercase tracking-tighter bg-zinc-100/50 px-2 py-1 rounded">
                                        #{p.sku}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border",
                                        p.stock === 0 ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100"
                                    )}>
                                        {p.stock === 0 ? "Sin Stock" : `${p.stock} Unidades`}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href="/admin/stock" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors group/link">
                                        Ajustar
                                        <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MOBILE */}
            <div className="flex flex-col divide-y divide-zinc-100 md:hidden">
                {products.map((p) => (
                    <div key={p.id} className="flex items-center justify-between px-4 py-4">
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                            <p className="font-bold text-base text-zinc-900 leading-snug">{p.name}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs text-zinc-400 uppercase tracking-tighter bg-zinc-100/50 px-2 py-0.5 rounded">
                                    #{p.sku}
                                </span>
                                <span className={cn(
                                    "inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest border",
                                    p.stock === 0 ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100"
                                )}>
                                    {p.stock === 0 ? "Sin Stock" : `${p.stock} u.`}
                                </span>
                            </div>
                        </div>
                        <Link href="/admin/stock" className="ml-3 shrink-0 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors group/link">
                            Ajustar
                            <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}