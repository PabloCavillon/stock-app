import Link from "next/link"
import clsx from "clsx"

type Product = {
    id: string
    name: string
    sku: string
    stock: number
}

export function LowStockTable({ products }: { products: Product[] }) {
    if (products.length === 0) return null

    return (
        <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-amber-100 flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="#d97706" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <h2 className="text-sm font-medium text-amber-700">Low stock warning</h2>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                            <td className="px-4 py-3">
                                <span className={clsx(
                                    "font-medium",
                                    p.stock === 0 ? "text-red-500" : "text-amber-500"
                                )}>
                                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <Link
                                    href="/stock"
                                    className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Adjust stock
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}