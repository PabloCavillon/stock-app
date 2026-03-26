import { getCustomer } from "@/actions/customers";
import { CustomerForm } from "@/components/customers/customer-form";
import { notFound } from "next/navigation";
import { ChevronLeft, Fingerprint } from "lucide-react"; // Fingerprint para representar el ID/Identidad
import Link from "next/link";

/**
 * Edit Customer Page
 * Design: Technical Minimalism
 * Features: Responsive layout, breadcrumbs-style navigation, and clear ID reference.
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
        <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-10 animate-in fade-in slide-in-from-top-2 duration-500">

            {/* Header & Navigation */}
            <header className="flex flex-col gap-6">
                <Link
                    href="/customers"
                    className="w-fit inline-flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors gap-2 group"
                >
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Volver al Directorio
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-100 pb-8">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
                            Editar Perfil
                        </h1>
                        <p className="text-zinc-500 font-light italic">
                            Modificando el registro de: <span className="text-zinc-900 font-medium not-italic">{customer.name}</span>
                        </p>
                    </div>

                    {/* Badge de ID para un look más "System" */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full">
                        <Fingerprint className="w-4 h-4 text-zinc-400" />
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tighter">
                            ID: {id.slice(-8)}...
                        </span>
                    </div>
                </div>
            </header>

            {/* Form Section */}
            <section className="bg-white rounded-4xl border border-zinc-100 p-8 md:p-12 shadow-sm">
                <CustomerForm customer={customer} />
            </section>

            {/* Footer Minimalista */}
            <footer className="text-center pt-4">
                <p className="text-[10px] text-zinc-300 uppercase tracking-[0.2em]">
                    Cuarzo Studio &copy; 2026 • Gestión de Clientes
                </p>
            </footer>
        </div>
    );
}