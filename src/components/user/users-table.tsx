'use client';

import { deleteUser } from "@/actions/users";
import { cn } from "@/lib/utils";
import { SerializedUser } from "@/types/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


const ROLE_STYLE: Record<string, string> = {
    ADMIN: "bg-purple-50 text-purple-700",
    SELLER: "bg-blue-50 text-blue-700",
    WAREHOUSE: "bg-amber-50 text-amber-700",
}

export default function UsersTable({ users: initialUsers }: { users: SerializedUser[] }) {

    const router = useRouter()
    const [users, setUsers] = useState(initialUsers)
    const [deleting, setDeleting] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm("¿Desea borrar el usuario?")) return
        setDeleting(id)
        await deleteUser(id)
        setUsers(prev => prev.filter(u => u.id !== id))
        setDeleting(null)
        router.refresh()
    }


    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                                No users found
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900">{user.username}</td>
                                <td className="px-4 py-3">
                                    <span className={cn("text-xs font-medium px-2 py-1 rounded-full", ROLE_STYLE[user.role])}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 text-xs">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/users/${user.id}/edit`}
                                            className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            disabled={deleting === user.id}
                                            className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
                                        >
                                            {deleting === user.id ? "Deleting..." : "Delete"}
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