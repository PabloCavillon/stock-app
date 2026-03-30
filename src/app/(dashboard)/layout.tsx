import { Sidebar } from "@/components/layout/sidebar"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: '%s | Projaska', // El %s se reemplaza por el título de la página hija
        default: 'Dashboard | Projaska', // Título si la página hija no define uno
    },
    description: "Sistema de gestión de inventario profesional",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}