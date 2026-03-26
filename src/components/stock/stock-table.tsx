'use client'

import { cn } from "@/lib/utils";
import { SerializedStockMovement } from "@/types/stock";
import { useState } from "react";

export function StockTable({ movements }: { movements: SerializedStockMovement[] }) {
    const [search, setSearch] = useState('')
    const filtered = movements.filter(m =>
        m.product.name.toLowerCase().includes(search.toLowerCase()) ||
        m.product.sku.toLowerCase().includes(search.toLowerCase()) ||
        m.reason?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <input
                    type="text"
                    placeholder="Search by product or reason..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-sm text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                No movements found
                            </td>
                        </tr>
                    ) : (
                        filtered.map((m) => (
                            <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-900">{m.product.name}</p>
                                    <p className="text-xs text-gray-400 font-mono">{m.product.sku}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={cn(
                                        "text-xs font-medium px-2 py-1 rounded-full",
                                        m.type === "IN" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                    )}>
                                        {m.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-700">{m.quantity}</td>
                                <td className="px-4 py-3 text-gray-500">{m.reason ?? "—"}</td>
                                <td className="px-4 py-3 text-gray-500">{m.user.username}</td>
                                <td className="px-4 py-3 text-gray-500 text-xs">
                                    {new Date(m.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}