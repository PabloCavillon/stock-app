import { getCustomer } from "@/actions/customers";
import { CustomerForm } from "@/components/customers/customer-form";
import { notFound } from "next/navigation";
import { ChevronLeft, Users } from "lucide-react";
import Link from "next/link";

/**
 * Edit Customer Page - Cuarzo Studio ADN
 * Design: High-end Minimalist
 */
export default async function EditCustomerPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const customer = await getCustomer(id);

    if (!customer) notFound();

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-10 animate-in fade-in duration-500">

            {/* Navegación Técnica */}
            <header className="space-y-6">
                <Link
                    href="/customers"
                    className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors gap-2 group"
                >
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Volver al Directorio
                </Link>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 rounded-[1.2rem]">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900">
                            Editar Perfil
                        </h1>
                        <p className="text-sm text-zinc-400 mt-1 font-light italic">
                            Modificando el registro de: <span className="text-zinc-900 font-medium not-italic">{customer.name}</span>
                        </p>
                    </div>
                </div>
            </header>

            {/* Contenedor Unificado (Igual al Login y Productos) */}
            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <CustomerForm customer={customer} />
            </section>

            <footer className="text-center">
                <p className="text-[10px] text-zinc-300 uppercase tracking-[0.3em] font-medium text-balance">
                    ID Ref: {id}
                </p>
            </footer>
        </div>
    );
}