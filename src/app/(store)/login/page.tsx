import { redirect } from "next/navigation";
import { getStoreSession } from "@/lib/store-auth";
import { loginStoreCustomer } from "@/actions/store/auth.actions";
import StoreLoginForm from "@/components/store/store-login-form";

export const metadata = { title: "Ingresar", robots: { index: false } };

interface LoginPageProps {
    searchParams: Promise<{ redirect?: string }>;
}

export default async function StoreLoginPage({ searchParams }: LoginPageProps) {
    const session = await getStoreSession();
    const params = await searchParams;

    if (session) redirect(params.redirect ?? "/");

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="mb-7 text-center">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-black text-base">P</span>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            Bienvenido
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Ingresá a tu cuenta de Projaska
                        </p>
                    </div>

                    <StoreLoginForm action={loginStoreCustomer} redirectTo={params.redirect} />
                </div>

                <p className="mt-5 text-center text-sm text-gray-400">
                    ¿No tenés cuenta?{" "}
                    <a href="/register" className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
                        Registrate gratis
                    </a>
                </p>
            </div>
        </div>
    );
}