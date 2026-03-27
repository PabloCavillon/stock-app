'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderForm({ customers, products }: { customers: any[], products: any[] }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<{ productId: string, quantity: number, price: number }[]>([]);

    // Estilos Unificados Cuarzo Studio
    const labelClasses = "text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2 ml-1 block";
    const inputClasses = "w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm transition-all outline-none focus:ring-1 focus:ring-zinc-900 placeholder:text-zinc-300";

    const addItem = () => {
        setSelectedItems([...selectedItems, { productId: "", quantity: 1, price: 0 }]);
    };

    const removeItem = (index: number) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    return (
        <form className="space-y-10">
            {/* Selección de Cliente */}
            <div className="flex flex-col">
                <label className={labelClasses}>Seleccionar Cliente</label>
                <select className={inputClasses}>
                    <option value="">Elegir cliente...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {/* Lista de Productos */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <label className={labelClasses}>Productos en la Orden</label>
                    <button
                        type="button"
                        onClick={addItem}
                        className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-1 hover:underline"
                    >
                        <Plus className="w-3 h-3" /> Agregar Ítem
                    </button>
                </div>

                <div className="space-y-3">
                    {selectedItems.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100 animate-in fade-in zoom-in-95">
                            <div className="flex-1">
                                <select className={inputClasses}>
                                    <option value="">Producto...</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price})</option>)}
                                </select>
                            </div>
                            <div className="w-full md:w-32">
                                <input type="number" placeholder="Cant." className={inputClasses} min="1" />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="p-3 text-zinc-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {selectedItems.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed border-zinc-100 rounded-[2rem]">
                            <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">No hay productos seleccionados</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Botonera de Acción */}
            <div className="flex flex-col-reverse md:flex-row gap-3 pt-8 border-t border-zinc-50">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 md:flex-none px-8 py-3.5 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-all"
                >
                    <X className="w-4 h-4 inline mr-2" /> Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading || selectedItems.length === 0}
                    className="flex-1 md:flex-none px-10 py-3.5 rounded-xl text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Finalizar Orden
                </button>
            </div>
        </form>
    );
}