import { getAllProducts } from "@/lib/services/products.service";
import ProductsTable from "@/components/products/ProductsTable";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
        <p className="text-muted-foreground">
          Gestiona el catálogo de productos del inventario
        </p>
      </div>

      <ProductsTable initialProducts={products} />
    </div>
  );
}
