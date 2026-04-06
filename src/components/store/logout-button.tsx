"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <form method="POST" action="/api/store/logout">
            <button
                type="submit"
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all"
                title="Cerrar sesión"
            >
                <LogOut size={18} />
            </button>
        </form>
    );
}