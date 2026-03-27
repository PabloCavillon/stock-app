import { getOrder } from "@/actions/orders";
import { notFound } from "next/navigation";
import { ChevronLeft, Receipt } from "lucide-react";
import Link from "next/link";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) notFound();

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-10 animate-in fade-in duration-500">

            <header className="space-y-6">
                <Link href="/orders" className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors gap-2 group">
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Volver al Listado
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-900 rounded-[1.2rem]">
                            <Receipt className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900">Orden #{id.slice(-6).toUpperCase()}</h1>
                            <p className="text-sm text-zinc-400 mt-1 font-light">Cliente: <span className="text-zinc-900 font-medium">{order.customer?.name}</span></p>
                        </div>
                    </div>

                    {/* Badge de Estado - Coherencia visual */}
                    <div className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Estado: {order.status}
                    </div>
                </div>
            </header>

            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                {/* Aquí iría el detalle de items de la orden, respetando el mismo estilo de tabla */}
                <div className="text-center text-zinc-400 text-xs uppercase tracking-[0.2em] py-20">
                    Cargando detalles de ítems...
                </div>
            </section>
        </div>
    );
}