'use client'

import { getCustomers } from "@/actions/customers"; 
import CustomersTable from "@/components/customers/customers-table";
import { Customer } from "@/generated/prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Users, Loader2 } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCustomers();
        setCustomers(res || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Pantalla de carga refinada
  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 animate-pulse">
        <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
        <p className="text-sm text-zinc-400 font-medium tracking-wide">Preparando directorio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 rounded-xl shadow-lg shadow-zinc-200">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Clientes
            </h1>
          </div>
          <p className="text-sm text-zinc-500 max-w-prose">
            Administra la base de contactos y clientes de <span className="text-zinc-900 font-medium">Cuarzo Studio</span>. 
            Total: <span className="text-zinc-900 font-semibold">{customers.length}</span>
          </p>
        </div>

        <Link
          href="/customers/new"
          className="inline-flex items-center justify-center gap-2 bg-white text-zinc-900 border border-zinc-200 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-all active:scale-[0.98] shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </Link>
      </header>

      {/* Main Table Container */}
      <div className="rounded-3xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
        <CustomersTable customers={customers} />
      </div>
    </div>
  );
}