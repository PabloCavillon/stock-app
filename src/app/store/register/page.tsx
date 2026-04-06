import { redirect } from "next/navigation";
import { getStoreSession } from "@/lib/store-auth";
import { registerStoreCustomer } from "@/actions/store/auth.actions";
import StoreRegisterForm from "@/components/store/store-register-form";

export default async function StoreRegisterPage() {
    const session = await getStoreSession();
    if (session) redirect("/store");

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                        Crear cuenta
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Registrate para acceder al catálogo y hacer pedidos
                    </p>
                </div>

                <StoreRegisterForm action={registerStoreCustomer} />

                <p className="mt-6 text-center text-sm text-gray-400">
                    ¿Ya tenés cuenta?{" "}
                    <a href="/store/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                        Ingresá acá
                    </a>
                </p>
            </div>
        </div>
    );
}