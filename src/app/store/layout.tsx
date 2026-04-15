import StoreNavbar from "@/components/store/store-navbar";
import { CartProvider } from "@/contexts/cart-context";
import { getStoreSession } from "@/lib/store-auth";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Projaska',
    description: 'Tecnología y seguridad para profesionales'
};

export default async function StoreLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getStoreSession();

    return (
        <CartProvider>
            <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
                <StoreNavbar session={session} />
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </main>
                <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400 tracking-widest uppercase">
                    © {new Date().getFullYear()} Projaska · Tecnología y Seguridad
                </footer>
            </div>
        </CartProvider>
    );
}