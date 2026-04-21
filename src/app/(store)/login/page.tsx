import { redirect } from "next/navigation";
import { getStoreSession } from "@/lib/store-auth";
import { loginStoreCustomer } from "@/actions/store/auth.actions";
import StoreLoginForm from "@/components/store/store-login-form";

interface LoginPageProps {
    searchParams: Promise<{ redirect?: string }>;
}

export default async function StoreLoginPage({ searchParams }: LoginPageProps) {
    const session = await getStoreSession();
    const params = await searchParams;

    if (session) redirect(params.redirect ?? "/");

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-8 sm:py-12">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                        Bienvenido
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Ingresá con tu cuenta para continuar
                    </p>
                </div>

                <StoreLoginForm action={loginStoreCustomer} redirectTo={params.redirect} />

                <p className="mt-6 text-center text-sm text-gray-400">
                    ¿No tenés cuenta?{" "}
                    <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                        Registrate acá
                    </a>
                </p>
            </div>
        </div>
    );
}