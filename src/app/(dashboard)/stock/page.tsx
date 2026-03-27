import { getProducts } from "@/actions/products";
import { getStockMovements } from "@/actions/stock";
import StockMovementForm from "@/components/stock/stock-movement-form";
import { StockTable } from "@/components/stock/stock-table";
import { Database, History, PlusCircle } from "lucide-react";

export default async function StockPage() {

	const [movements, products] = await Promise.all([
		getStockMovements(),
		getProducts()
	])

	return (
		<div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-700">

			{/* Header Unificado */}
			<header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="space-y-2">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-zinc-100 rounded-xl">
							<Database className="w-5 h-5 text-zinc-900" />
						</div>
						<h1 className="text-3xl font-extrabold tracking-tighter text-zinc-900">
							Control de Stock
						</h1>
					</div>
					<p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">
						Ajustes manuales e historial de movimientos
					</p>
				</div>
			</header>

			{/* Grid de contenido con estilo de tarjeta */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

				{/* Columna: Nuevo Ajuste (Formulario) */}
				<div className="lg:col-span-1 space-y-4">
					<div className="flex items-center gap-2 px-1">
						<PlusCircle className="w-4 h-4 text-zinc-400" />
						<h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Nuevo Ajuste</h2>
					</div>
					<div className="bg-white p-6 rounded-4xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
						<StockMovementForm products={products} />
					</div>
				</div>

				{/* Columna: Historial (Tabla) */}
				<div className="lg:col-span-2 space-y-4">
					<div className="flex items-center gap-2 px-1">
						<History className="w-4 h-4 text-zinc-400" />
						<h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Historial de Movimientos</h2>
					</div>
					<div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
						<StockTable movements={movements} />
					</div>
				</div>
			</div>
		</div>
	)

}