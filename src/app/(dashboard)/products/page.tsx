import { getProducts } from "@/actions/products";
import ProductsTable from "@/components/products/products-table";
import { Package } from "lucide-react";
import { PageLayout } from "@/components/common/layout-page";

export default async function ProductsPage() {
	const products = await getProducts();

	return (
		<PageLayout
			title="Productos"
			subtitle={`Inventario Total: ${products.length} artículos`}
			icon={Package}
			buttonText="Agregar Producto"
			buttonHref="/products/new"
		>
			<ProductsTable products={products} />
		</PageLayout>
	);
}