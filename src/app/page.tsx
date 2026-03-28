import { getAllProducts } from "@/lib/services/products.service";
import { getAllMovements } from "@/lib/services/movements.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const products = getAllProducts();
  const movements = getAllMovements();

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active).length;
  const totalEntries = movements.filter((m) => m.type === "in").reduce((sum, m) => sum + m.quantity, 0);
  const totalExits = movements.filter((m) => m.type === "out").reduce((sum, m) => sum + m.quantity, 0);
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const recentMovements = movements.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del inventario</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">{activeProducts} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas totales</CardTitle>
            <ArrowDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntries}</div>
            <p className="text-xs text-muted-foreground">unidades ingresadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salidas totales</CardTitle>
            <ArrowUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExits}</div>
            <p className="text-xs text-muted-foreground">unidades despachadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock bajo</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">productos con ≤5 unidades</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Productos con stock bajo</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todos los productos tienen stock suficiente.</p>
            ) : (
              <ul className="space-y-2">
                {lowStockProducts.map((p) => (
                  <li key={p.id} className="flex items-center justify-between">
                    <Link href={`/products/${p.id}`} className="text-sm font-medium hover:underline">
                      {p.name}
                    </Link>
                    <Badge variant={p.stock === 0 ? "destructive" : "secondary"}>
                      {p.stock} uds.
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMovements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay movimientos registrados.</p>
            ) : (
              <ul className="space-y-2">
                {recentMovements.map((m) => (
                  <li key={m.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{m.product_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{m.quantity} uds.</span>
                      <Badge variant={m.type === "in" ? "default" : "destructive"} className="text-xs">
                        {m.type === "in" ? "Entrada" : "Salida"}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
