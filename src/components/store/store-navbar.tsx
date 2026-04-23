'use client';

import { useCart } from "@/contexts/cart-context";
import { StoreSession } from "@/lib/store-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogIn, LogOut, Menu, Package, ShoppingCart, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LogoutButton from "./logout-button";

interface StoreNavbarProps {
    session: StoreSession | null;
}

export default function StoreNavbar({ session }: StoreNavbarProps) {
    const { itemCount } = useCart();
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 shrink-0 group"
                >
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                        <span className="text-white font-black text-[11px] tracking-tight">P</span>
                    </span>
                    <span className="text-gray-900 font-bold text-base tracking-tight">
                        Projaska
                    </span>
                </Link>

                {/* Nav — desktop */}
                <nav className="hidden md:flex items-center gap-1 text-sm">
                    <Link
                        href="/"
                        className="px-3 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all font-medium"
                    >
                        Catálogo
                    </Link>
                    {session && (
                        <Link
                            href="/orders"
                            className="px-3 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all font-medium flex items-center gap-1.5"
                        >
                            <Package size={14} />
                            Mis pedidos
                        </Link>
                    )}
                </nav>

                {/* Actions — desktop */}
                <div className="hidden md:flex items-center gap-1.5">
                    <ThemeToggle className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all" />

                    <Link
                        href="/cart"
                        className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all"
                        title="Carrito"
                    >
                        <ShoppingCart size={18} />
                        {itemCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-indigo-600 text-white text-[9px] font-black px-1 leading-none">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    {session ? (
                        <div className="flex items-center gap-2 pl-1.5 ml-0.5 border-l border-gray-100">
                            <span className="text-sm text-gray-500 font-medium">
                                {session.name.split(" ")[0]}
                            </span>
                            <LogoutButton />
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 pl-1.5 ml-0.5 border-l border-gray-100">
                            <Link
                                href="/login"
                                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 font-medium"
                            >
                                <LogIn size={14} />
                                Ingresar
                            </Link>
                            <Link
                                href="/register"
                                className="flex items-center gap-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-all hover:shadow-md hover:shadow-indigo-200"
                            >
                                <UserPlus size={14} />
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile: carrito + hamburguesa */}
                <div className="flex md:hidden items-center gap-0.5">
                    <ThemeToggle className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all" />
                    <Link
                        href="/cart"
                        className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all"
                        title="Carrito"
                    >
                        <ShoppingCart size={20} />
                        {itemCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-indigo-600 text-white text-[9px] font-black px-1 leading-none">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all cursor-pointer"
                        aria-label="Menú"
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1">
                    <Link
                        href="/"
                        onClick={() => setMenuOpen(false)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-xl transition-all"
                    >
                        Catálogo
                    </Link>

                    {session ? (
                        <>
                            <Link
                                href="/orders"
                                onClick={() => setMenuOpen(false)}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-xl transition-all flex items-center gap-2"
                            >
                                <Package size={14} />
                                Mis pedidos
                            </Link>
                            <div className="border-t border-gray-100 mt-2 pt-2">
                                <p className="text-xs text-gray-400 px-3 pb-2">{session.email}</p>
                                <LogoutButton />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2 mt-1 pt-2 border-t border-gray-100">
                            <Link
                                href="/login"
                                onClick={() => setMenuOpen(false)}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-xl transition-all flex items-center gap-2"
                            >
                                <LogIn size={14} />
                                Ingresar
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setMenuOpen(false)}
                                className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-3 rounded-xl transition-all flex items-center gap-2"
                            >
                                <UserPlus size={14} />
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
