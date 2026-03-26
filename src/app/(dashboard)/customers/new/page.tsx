import { CustomerForm } from "@/components/customers/customer-form";
import { ChevronLeft, UserPlus } from "lucide-react";
import Link from "next/link";

export default function NewCustomerPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header con navegación de retorno */}
      <header className="space-y-4">
        <Link 
          href="/customers" 
          className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors gap-1 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al listado
        </Link>
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-2xl hidden md:block">
            <UserPlus className="w-6 h-6 text-zinc-900" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Nuevo Cliente
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Completa los datos para registrar un nuevo contacto en el sistema.
            </p>
          </div>
        </div>
      </header>

      {/* Card del Formulario */}
      <section className="bg-white p-8 md:p-10 rounded-3xl border border-zinc-100 shadow-sm shadow-zinc-100/50">
        <CustomerForm />
      </section>

      {/* Footer de ayuda (opcional, muy minimalista) */}
      <footer className="text-center">
        <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
          Sistema de Gestión Interna • Cuarzo Studio
        </p>
      </footer>
    </div>
  );
}