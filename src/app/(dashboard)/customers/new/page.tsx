import { CustomerForm } from "@/components/customers/customer-form";
import { ChevronLeft, UserPlus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: 'Nuevo cliente', 
};

export default function NewCustomerPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

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
          <div className="p-3 bg-zinc-100 rounded-[1.2rem]">
            <UserPlus className="w-6 h-6 text-zinc-900" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900">
              Nuevo Cliente
            </h1>
            <p className="text-sm text-zinc-400 mt-1 font-light italic text-balance">
              Completa los datos para registrar un nuevo contacto en el sistema.
            </p>
          </div>
        </div>
      </header>

      {/* Contenedor Unificado (Igual al Login y Productos) */}
      <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <CustomerForm />
      </section>

      <footer className="text-center">
        <p className="text-[10px] text-zinc-300 uppercase tracking-[0.3em] font-medium">
          Cuarzo Studio • CRM Module
        </p>
      </footer>
    </div>
  );
}