import StoreNavbar from "@/components/store/store-navbar";
import { CartProvider } from "@/contexts/cart-context";
import { ServiceWorkerRegistrar } from "@/components/store/service-worker-registrar";
import { getStoreSession } from "@/lib/store-auth";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: { default: "Projaska — Tecnología y Seguridad", template: "%s | Projaska" },
    description: "Tienda online de tecnología y seguridad para profesionales. Cámaras, alarmas, cerraduras y más con envío a todo el país.",
    openGraph: {
        type: "website",
        locale: "es_AR",
        siteName: "Projaska",
    },
    twitter: { card: "summary_large_image" },
};

export default async function StoreLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getStoreSession();

    return (
        <CartProvider>
            <ServiceWorkerRegistrar />
            <div className="min-h-screen flex flex-col bg-gray-50">
                <StoreNavbar session={session} />
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                    {children}
                </main>
                <footer className="border-t border-gray-100 py-8 text-center text-[11px] text-gray-400 tracking-widest uppercase">
                    © {new Date().getFullYear()} Projaska · Tecnología y Seguridad
                </footer>
            </div>
        </CartProvider>
    );
}