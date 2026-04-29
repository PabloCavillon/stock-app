import { Sidebar } from "@/components/layout/sidebar"
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: { template: "%s | Projaska Admin", default: "Dashboard | Projaska" },
    description: "Sistema de gestión de inventario profesional",
    robots: { index: false, follow: false },
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                {children}
            </main>
        </div>
    )
}