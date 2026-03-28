import { notFound } from "next/navigation";
import { getProductById } from "@/lib/services/products.service";
import { getMovementsByProductId } from "@/lib/services/movements.service";
import { getAllProducts } from "@/lib/services/products.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MovementsTable from "@/components/movements/MovementsTable";
import type { MovementWithProduct } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) notFound();

  const product = getProductById(productId);
  if (!product) notFound();

  const rawMovements = getMovementsByProductId(productId);
  const movements: MovementWithProduct[] = rawMovements.map((m) => ({
    ...m,
    product_name: product.name,
  }));

  const allProducts = getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground">Detalle del producto y movimientos asociados</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{product.stock}</div>
            <p className="text-xs text-muted-foreground">unidades disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Precio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" }).format(
                product.price
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estado</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Badge variant={product.active ? "default" : "secondary"} className="text-sm">
              {product.active ? "Activo" : "Inactivo"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {product.description && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{product.description}</p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Movimientos del producto</h2>
        <MovementsTable
          initialMovements={movements}
          products={allProducts}
          showProductColumn={false}
          preselectedProductId={productId}
        />
      </div>
    </div>
  );
}
