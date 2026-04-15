'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteKit } from "@/actions/kits";
import { SerializedKit } from "@/types/kit";
import { SearchInput } from "@/components/ui/search-input";
import { Edit2, Trash2, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function KitsTable({ kits: initialKits }: { kits: SerializedKit[] }) {
    const router = useRouter();
    const [kits, setKits] = useState<SerializedKit[]>(initialKits);
    const [search, setSearch] = useState("");
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = kits.filter((k) => {
        const q = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return [k.name, k.sku].some((f) => {
            if (!f) return false;
            return f.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q);
        });
    });

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este kit? Esta acción no se puede deshacer.")) return;
        setIsDeletingId(id);
        try {
            await deleteKit(id);
            setKits((prev) => prev.filter((k) => k.id !== id));
            router.refresh();
        } finally {
            setIsDeletingId(null);
        }
    };

    const thClasses = "px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] text-left";

    return (
        <div className="flex flex-col">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar kits..." />

            {filtered.length === 0 ? (
                <div className="py-20 text-center text-zinc-400 italic font-light">
                    No se encontraron kits.
                </div>
            ) : (
                <>
                    {/* DESKTOP */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-50">
                                    <th className={thClasses}>SKU</th>
                                    <th className={thClasses}>Nombre</th>
                                    <th className={thClasses}>Precio USD</th>
                                    <th className={thClasses}>Ítems</th>
                                    <th className={thClasses}>Estado</th>
                                    <th className="px-6 py-4" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {filtered.map((kit) => (
                                    <>
                                        <tr
                                            key={kit.id}
                                            className="group hover:bg-zinc-50/50 transition-colors cursor-pointer"
                                            onClick={() => setExpandedId(expandedId === kit.id ? null : kit.id)}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-md text-zinc-400 uppercase tracking-tighter bg-zinc-100/50 px-2 py-1 rounded">
                                                    #{kit.sku}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-base text-zinc-900 flex items-center gap-2">
                                                {expandedId === kit.id
                                                    ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                                    : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                                                {kit.name}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-base text-zinc-900">
                                                USD {Number(kit.price).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-500">
                                                {kit.items.length} {kit.items.length === 1 ? "ítem" : "ítems"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest border",
                                                    kit.isActive
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                        : "bg-zinc-100 text-zinc-400 border-zinc-200"
                                                )}>
                                                    {kit.isActive ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <Link
                                                        href={`/kits/${kit.id}/edit`}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(kit.id)}
                                                        disabled={isDeletingId === kit.id}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                                                    >
                                                        {isDeletingId === kit.id
                                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                                            : <Trash2 className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Expanded items row */}
                                        {expandedId === kit.id && (
                                            <tr key={`${kit.id}-items`} className="bg-zinc-50/70">
                                                <td colSpan={6} className="px-10 py-3">
                                                    <ul className="space-y-1">
                                                        {kit.items.map((item) => (
                                                            <li key={item.id} className="flex items-center gap-2 text-sm text-zinc-600">
                                                                <span className={cn(
                                                                    "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                                                                    item.childKitId ? "bg-violet-100 text-violet-700" : "bg-blue-50 text-blue-700"
                                                                )}>
                                                                    {item.childKitId ? "Kit" : "Prod"}
                                                                </span>
                                                                <span className="font-medium">
                                                                    {item.productName ?? item.childKitName}
                                                                </span>
                                                                <span className="text-zinc-400">×{item.quantity}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE */}
                    <div className="flex flex-col divide-y divide-zinc-100 md:hidden">
                        {filtered.map((kit) => (
                            <div key={kit.id} className="px-4 py-4">
                                <div className="flex items-start justify-between">
                                    <div
                                        className="flex flex-col gap-1.5 flex-1 min-w-0 cursor-pointer"
                                        onClick={() => setExpandedId(expandedId === kit.id ? null : kit.id)}
                                    >
                                        <span className="font-mono text-xs text-zinc-400 uppercase tracking-tighter bg-zinc-100/50 px-2 py-0.5 rounded w-fit">
                                            #{kit.sku}
                                        </span>
                                        <p className="font-bold text-base text-zinc-900">{kit.name}</p>
                                        <div className="flex items-center gap-2 flex-wrap mt-1">
                                            <span className="font-bold text-sm text-zinc-900">
                                                USD {Number(kit.price).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                                            </span>
                                            <span className={cn(
                                                "inline-flex px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest border",
                                                kit.isActive
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                    : "bg-zinc-100 text-zinc-400 border-zinc-200"
                                            )}>
                                                {kit.isActive ? "Activo" : "Inactivo"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 ml-3 shrink-0">
                                        <Link href={`/kits/${kit.id}/edit`}
                                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all">
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(kit.id)} disabled={isDeletingId === kit.id}
                                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all">
                                            {isDeletingId === kit.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {expandedId === kit.id && (
                                    <ul className="mt-3 space-y-1 pl-1">
                                        {kit.items.map((item) => (
                                            <li key={item.id} className="flex items-center gap-2 text-sm text-zinc-600">
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                                                    item.childKitId ? "bg-violet-100 text-violet-700" : "bg-blue-50 text-blue-700"
                                                )}>
                                                    {item.childKitId ? "Kit" : "Prod"}
                                                </span>
                                                <span className="font-medium">{item.productName ?? item.childKitName}</span>
                                                <span className="text-zinc-400">×{item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
