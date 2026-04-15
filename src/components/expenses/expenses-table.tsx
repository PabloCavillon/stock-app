'use client';

import { deleteExpense } from "@/actions/expenses";
import { SerializedExpense } from "@/types/expense";
import { cn } from "@/lib/utils";
import { Calendar, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchInput } from "../ui/search-input";

const TYPE_LABEL: Record<string, string> = {
    PURCHASE: "Compra",
    SHIPPING: "Envío",
    OTHER: "Otro",
};

const TYPE_STYLE: Record<string, string> = {
    PURCHASE: "bg-blue-50 text-blue-700 border-blue-100",
    SHIPPING: "bg-amber-50 text-amber-700 border-amber-100",
    OTHER: "bg-zinc-50 text-zinc-600 border-zinc-200",
};

function fmtArs(n: number) {
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function fmtUsd(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

export function ExpensesTable({
    expenses: initial,
    isAdmin,
}: {
    expenses: SerializedExpense[];
    isAdmin: boolean;
}) {
    const router = useRouter();
    const [expenses, setExpenses] = useState(initial);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);

    const filtered = expenses.filter((e) =>
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        TYPE_LABEL[e.type].toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este gasto?")) return;
        setDeleting(id);
        await deleteExpense(id);
        setExpenses((prev) => prev.filter((e) => e.id !== id));
        setDeleting(null);
        router.refresh();
    };

    const thClasses = "px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] text-left";

    return (
        <div className="flex flex-col">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar por descripción o tipo..." />

            {filtered.length === 0 ? (
                <div className="py-20 text-center text-zinc-400 italic font-light">
                    No se encontraron gastos registrados.
                </div>
            ) : (
                <>
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-100">
                                    <th className={thClasses}>Tipo</th>
                                    <th className={thClasses}>Descripción</th>
                                    <th className={thClasses}>Monto</th>
                                    <th className={thClasses}>Fecha</th>
                                    <th className={thClasses}>Usuario</th>
                                    {isAdmin && <th className="px-6 py-4" />}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {filtered.map((e) => (
                                    <tr key={e.id} className="group hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border", TYPE_STYLE[e.type])}>
                                                {TYPE_LABEL[e.type]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-base text-zinc-900">{e.description}</p>
                                            {e.notes && <p className="text-xs text-zinc-400 mt-0.5">{e.notes}</p>}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-base text-zinc-900">
                                            {e.amountUsd !== null ? (
                                                <span>
                                                    {fmtUsd(e.amountUsd)}
                                                    {e.dollarRate && (
                                                        <span className="block text-xs text-zinc-400 font-normal">
                                                            ≈ {fmtArs(e.amountUsd * e.dollarRate)}
                                                        </span>
                                                    )}
                                                </span>
                                            ) : (
                                                fmtArs(e.amountArs ?? 0)
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                                {new Date(e.date).toLocaleDateString("es-AR")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-zinc-600 bg-zinc-100 px-2 py-1 rounded-md">
                                                {e.user.username}
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(e.id)}
                                                    disabled={deleting === e.id}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    {deleting === e.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col divide-y divide-zinc-100 md:hidden">
                        {filtered.map((e) => (
                            <div key={e.id} className="flex items-start justify-between px-4 py-4">
                                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest border", TYPE_STYLE[e.type])}>
                                            {TYPE_LABEL[e.type]}
                                        </span>
                                        <span className="font-bold text-base text-zinc-900">
                                            {e.amountUsd !== null ? fmtUsd(e.amountUsd) : fmtArs(e.amountArs ?? 0)}
                                        </span>
                                    </div>
                                    <p className="font-bold text-sm text-zinc-900">{e.description}</p>
                                    <div className="flex items-center gap-3 flex-wrap text-sm text-zinc-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                            {new Date(e.date).toLocaleDateString("es-AR")}
                                        </span>
                                        <span className="font-medium text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md text-xs">
                                            {e.user.username}
                                        </span>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDelete(e.id)}
                                        disabled={deleting === e.id}
                                        className="ml-3 shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                                    >
                                        {deleting === e.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
