'use client';

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    UserCircle,
    Users as TeamIcon,
    Database,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ScrollText,
    Settings,
    Receipt,
    Boxes,
} from "lucide-react";

const navigation = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "SELLER", "WATCHER"] },
    { label: "Órdenes", href: "/orders", icon: ScrollText, roles: ["ADMIN", "SELLER", "WAREHOUSE"] },
    { label: "Productos", href: "/products", icon: Package, roles: ["ADMIN", "SELLER"] },
    { label: "Clientes", href: "/customers", icon: UserCircle, roles: ["ADMIN", "SELLER"] },
    { label: "Stock", href: "/stock", icon: Database, roles: ["ADMIN"] },
    { label: "Kits", href: "/kits", icon: Boxes, roles: ["ADMIN", "SELLER"] },
    { label: "Gastos", href: "/expenses", icon: Receipt, roles: ["ADMIN", "SELLER"] },
    { label: "Usuarios", href: "/users", icon: TeamIcon, roles: ["ADMIN"] },
    { label: "Tienda", href: "/store", icon: ShoppingCart, roles: ["ADMIN", "SELLER", "WATCHER"] },
    { label: "Configuración", href: "/config", icon: Settings, roles: ["ADMIN"] },
];

export default function SidebarClient({ role }: { role: string }) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const filteredNavigation = navigation.filter(item =>
        !item.roles || item.roles.includes(role)
    );

    const mobileNav = filteredNavigation;

    return (
        <>
            {/* ── DESKTOP: sidebar lateral ── */}
            <aside
                className={`
                    hidden md:flex flex-col bg-white border-r border-zinc-100 transition-all duration-300 ease-in-out h-screen sticky top-0
                    ${collapsed ? "w-20" : "w-64"}
                `}
            >
                {/* Header / Logo */}
                <div className={`flex items-center h-20 px-6 border-b border-zinc-100 ${collapsed ? "justify-center" : "justify-between"}`}>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-zinc-900 tracking-tighter uppercase">
                                Cuarzo <span className="text-zinc-400">Studio</span>
                            </span>
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest -mt-1">
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
                                    <span className={`font-bold tracking-tight text-base ${isActive ? "text-white" : "text-zinc-600"}`}>
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign out + theme */}
                <div className="p-4 border-t border-zinc-100 flex flex-col gap-1">
                    <ThemeToggle
                        showLabel={!collapsed}
                        className={`
                            w-full flex items-center gap-3 px-3 py-3 rounded-xl text-base font-bold text-zinc-500
                            hover:bg-zinc-50 hover:text-zinc-900 transition-all active:scale-[0.98]
                            ${collapsed ? "justify-center" : ""}
                        `}
                    />
                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className={`
                            w-full flex items-center gap-3 px-3 py-3 rounded-xl text-base font-bold text-zinc-500
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

            {/* ── MOBILE: bottom navigation bar ── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-100 safe-area-inset-bottom">
                <div className="flex items-center overflow-x-auto scrollbar-none px-1">
                    {mobileNav.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all shrink-0 min-w-14 ${isActive ? "text-zinc-900" : "text-zinc-400"}`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                                <span className={`text-[9px] font-bold uppercase tracking-wide leading-none ${isActive ? "text-zinc-900" : "text-zinc-400"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Theme toggle */}
                    <ThemeToggle className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all shrink-0 min-w-14" />

                    {/* Logout */}
                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-red-500 transition-all shrink-0 min-w-14"
                    >
                        <LogOut size={20} strokeWidth={1.8} />
                        <span className="text-[9px] font-bold uppercase tracking-wide leading-none">Salir</span>
                    </button>
                </div>
            </nav>

            {/* Espaciado para que el contenido no quede tapado por la bottom bar */}
            <div className="md:hidden h-16" />
        </>
    );
}