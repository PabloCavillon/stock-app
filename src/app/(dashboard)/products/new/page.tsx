import { ProductForm } from "@/components/products/product-form"


export default function NewProductPage () {
    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Producto Nuevo</h1>
                <p className="text-sm text-gray-500 mt-0.5">Agregar nuevo producto al inventario</p>
            </div>
            <ProductForm />
        </div>
    )
}