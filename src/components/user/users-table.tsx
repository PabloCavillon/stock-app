'use client';

import { deleteUser } from "@/actions/users";
import { cn } from "@/lib/utils";
import { SerializedUser } from "@/types/user";
import { Calendar, Edit2, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchInput } from "../common/search-input";
import { Role } from "@/generated/prisma/enums";


const ROLE_STYLE: Record<Role, string> = {
    ADMIN: "bg-purple-50 text-purple-700",
    SELLER: "bg-blue-50 text-blue-700",
    WAREHOUSE: "bg-amber-50 text-amber-700",
    WATCHER: "bg-amber-50 text-amber-700",
}

const ROLE_TRANSLATE: Record<Role, string> = {
    ADMIN: "Administrador",
    SELLER: "Vendedor",
    WAREHOUSE: "Depósito",
    WATCHER: "Observador",
}

export default function UsersTable({ users: initialUsers }: { users: SerializedUser[] }) {

    const router = useRouter()
    const [users, setUsers] = useState(initialUsers)
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null)

    const filtered = users.filter(u => {
        const s = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return (
            (u.username || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(s) ||
            (u.id || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(s)
        );
    });

    const handleDelete = async (id: string) => {
        if (!confirm("¿Desea borrar el usuario?")) return
        setDeleting(id)
        await deleteUser(id)
        setUsers(prev => prev.filter(u => u.id !== id))
        setDeleting(null)
        router.refresh()
    }

    const thClasses = "px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-left";

    return (
        <div className="flex flex-col">
            {/* Usamos el componente SearchInput para mantener la coherencia si lo necesitas aquí también */}
            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Buscar por nombre de usuario o rol..."
            />

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-50">
                            <th className={thClasses}>Usuario</th>
                            <th className={thClasses}>Rol / Permisos</th>
                            <th className={thClasses}>Fecha de Creación</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center text-zinc-400 italic font-light">
                                    No se encontraron usuarios registrados.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((user) => (
                                <tr key={user.id} className="group hover:bg-zinc-50/50 transition-colors">
                                    {/* Username con Badge de Usuario */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold text-xs">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-zinc-900">{user.username}</span>
                                        </div>
                                    </td>

                                    {/* Role con estilo de Badge unificado */}
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                            user.role === Role.ADMIN
                                                ? "bg-purple-50 text-purple-700 border-purple-100"
                                                : "bg-zinc-50 text-zinc-600 border-zinc-100"
                                        )}>
                                            {ROLE_TRANSLATE[user.role]}
                                        </span>
                                    </td>

                                    {/* Fecha de creación con Icono */}
                                    <td className="px-6 py-4 text-zinc-400 text-xs">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                            {new Date(user.createdAt).toLocaleDateString('es-AR')}
                                        </div>
                                    </td>

                                    {/* Acciones en Hover */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <Link
                                                href={`/users/${user.id}/edit`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all shadow-none hover:shadow-sm"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                disabled={deleting === user.id}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                                            >
                                                {deleting === user.id ? (
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