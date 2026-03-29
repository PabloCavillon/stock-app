'use client';

import { deleteCustomer } from "@/actions/customers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchInput } from "../common/search-input";
import { Edit2, Loader2, Trash2 } from "lucide-react";
import { SerializedCustomer } from "@/types/customer";

export default function CustomersTable({ customers: initialCustomers }: { customers: SerializedCustomer[] }) {

    const router = useRouter();
    const [customers, setCustomers] = useState<SerializedCustomer[]>(initialCustomers);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm("¿Desea eliminar el cliente?")) return;
        setDeleting(id);
        await deleteCustomer(id);
        setCustomers(prev => prev.filter(c => c.id !== id));
        setDeleting(null);
        router.refresh();
    }

    const thClasses = "px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-left";

    return (
        <div className="flex flex-col">
            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Buscar por nombre, email o dirección..."
            />

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-50">
                            <th className={thClasses}>Nombre</th>
                            <th className={thClasses}>Email</th>
                            <th className={thClasses}>Teléfono</th>
                            <th className={thClasses}>Dirección</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-zinc-400 italic font-light">
                                    No se encontraron clientes registrados.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((customer) => (
                                <tr key={customer.id} className="group hover:bg-zinc-50/50 transition-colors">
                                    {/* Nombre Destacado */}
                                    <td className="px-6 py-4 font-bold text-zinc-900">
                                        {customer.name}
                                    </td>

                                    {/* Email con estilo sutil */}
                                    <td className="px-6 py-4 text-zinc-500">
                                        {customer.email ?? "—"}
                                    </td>

                                    {/* Teléfono */}
                                    <td className="px-6 py-4 text-zinc-500 font-medium">
                                        {customer.phone ?? "—"}
                                    </td>

                                    {/* Dirección */}
                                    <td className="px-6 py-4 text-zinc-400 text-xs">
                                        {customer.address ?? "—"}
                                    </td>

                                    {/* Acciones (Hover) */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <Link
                                                href={`/customers/${customer.id}/edit`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all shadow-none hover:shadow-sm"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(customer.id)}
                                                disabled={deleting === customer.id}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                                            >
                                                {deleting === customer.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}