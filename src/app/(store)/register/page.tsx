import { redirect } from "next/navigation";
import { getStoreSession } from "@/lib/store-auth";
import { registerStoreCustomer } from "@/actions/store/auth.actions";
import StoreRegisterForm from "@/components/store/store-register-form";

export const metadata = { title: "Crear cuenta", robots: { index: false } };

export default async function StoreRegisterPage() {
    const session = await getStoreSession();
    if (session) redirect("/");

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="mb-7 text-center">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-black text-base">P</span>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            Crear cuenta
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Registrate para acceder al catálogo y hacer pedidos
                        </p>
                    </div>

                    <StoreRegisterForm action={registerStoreCustomer} />
                </div>

                <p className="mt-5 text-center text-sm text-gray-400">
                    ¿Ya tenés cuenta?{" "}
                    <a href="/login" className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
                        Ingresá acá
                    </a>
                </p>
            </div>
        </div>
    );
}