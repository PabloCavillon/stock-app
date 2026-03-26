'use client';

import { deleteCustomer } from "@/actions/customers";
import { Customer } from "@/generated/prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CustomersTable({ customers: initialCustomers }: { customers: Customer[] }) {

    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
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

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-sm text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                                No customers found
                            </td>
                        </tr>
                    ) : (
                        filtered.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900">{customer.name}</td>
                                <td className="px-4 py-3 text-gray-500">{customer.email ?? "—"}</td>
                                <td className="px-4 py-3 text-gray-500">{customer.phone ?? "—"}</td>
                                <td className="px-4 py-3 text-gray-500">{customer.address ?? "—"}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/customers/${customer.id}/edit`}
                                            className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(customer.id)}
                                            disabled={deleting === customer.id}
                                            className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
                                        >
                                            {deleting === customer.id ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}