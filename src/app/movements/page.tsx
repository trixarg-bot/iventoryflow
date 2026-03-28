import { getAllMovements } from "@/lib/services/movements.service";
import { getAllProducts } from "@/lib/services/products.service";
import MovementsTable from "@/components/movements/MovementsTable";

export const dynamic = "force-dynamic";

export default function MovementsPage() {
  const movements = getAllMovements();
  const products = getAllProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Movimientos</h1>
        <p className="text-muted-foreground">
          Registro de entradas y salidas del inventario
        </p>
      </div>

      <MovementsTable initialMovements={movements} products={products} />
    </div>
  );
}
