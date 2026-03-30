'use client';

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    UserCircle,
    Users as TeamIcon,
    Database,
    LogOut,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

// Agregamos 'roles' a la configuración. 
// Si no tiene 'roles', asumimos que es público para cualquier logueado.
const navigation = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "SELLER", "WATCHER"] },
    { label: "Órdenes", href: "/orders", icon: ShoppingCart, roles: ["ADMIN", "SELLER", "WAREHOUSE"] },
    { label: "Productos", href: "/products", icon: Package, roles: ["ADMIN", "SELLER"] },
    { label: "Clientes", href: "/customers", icon: UserCircle, roles: ["ADMIN", "SELLER"] },
    { label: "Stock", href: "/stock", icon: Database, roles: ["ADMIN"] },
    { label: "Usuarios", href: "/users", icon: TeamIcon, roles: ["ADMIN"] },
];

export default function SidebarClient({ role }: { role: string }) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    // FILTRO CRUCIAL: Solo mostramos lo que el rol del usuario permite
    const filteredNavigation = navigation.filter(item =>
        !item.roles || item.roles.includes(role)
    );

    return (
        <aside
            className={`
                flex flex-col bg-white border-r border-zinc-100 transition-all duration-300 ease-in-out h-screen sticky top-0
                ${collapsed ? "w-20" : "w-64"}
            `}
        >
            {/* Header / Logo */}
            <div className={`flex items-center h-20 px-6 border-b border-zinc-50 ${collapsed ? "justify-center" : "justify-between"}`}>
                {!collapsed && (
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-zinc-900 tracking-tighter uppercase">
                            Cuarzo <span className="text-zinc-400">Studio</span>
                        </span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest -mt-1">
                            Stock Manager
                        </span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-xl bg-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all active:scale-95"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-6 flex flex-col gap-1.5">
                {/* Usamos el array filtrado aquí */}
                {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group
                                ${collapsed ? "justify-center" : ""}
                                ${isActive
                                    ? "bg-zinc-900 text-white shadow-md shadow-zinc-200"
                                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                }
                            `}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon size={20} className={`${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900"} transition-colors`} />
                            {!collapsed && (
                                <span className={`font-bold tracking-tight ${isActive ? "text-white" : "text-zinc-600"}`}>
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Sign out */}
            <div className="p-4 border-t border-zinc-50">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-zinc-500
                        hover:bg-red-50 hover:text-red-600 transition-all active:scale-[0.98]
                        ${collapsed ? "justify-center" : ""}
                    `}
                    title={collapsed ? "Cerrar sesión" : undefined}
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Cerrar sesión</span>}
                </button>
            </div>
        </aside>
    );
}