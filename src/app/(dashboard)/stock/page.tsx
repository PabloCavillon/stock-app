import { getProducts } from "@/actions/products";
import { getStockMovements } from "@/actions/stock";
import StockMovementForm from "@/components/stock/stock-movement-form";
import { StockTable } from "@/components/stock/stock-table";



export default async function StockPage() {

	const [movements, products] = await Promise.all([
		getStockMovements(),
		getProducts()
	])

	return (
		<div className="p-8">
			<div className="mb-6">
				<h1 className="text-xl font-semibold text-gray-900">Stock</h1>
				<p className="text-sm text-gray-500 mt-0.5">Manual adjustments and movement history</p>
			</div>

			<div className="grid grid-cols-3 gap-8">
				<div className="col-span-1">
					<h2 className="text-sm font-medium text-gray-700 mb-3">New adjustment</h2>
					<StockMovementForm products={products} />
				</div>
				<div className="col-span-2">
					<h2 className="text-sm font-medium text-gray-700 mb-3">Movement history</h2>
					<StockTable movements={movements} />
				</div>
			</div>
		</div>
	)

}