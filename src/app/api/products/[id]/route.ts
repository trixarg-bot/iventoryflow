import { NextResponse } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/services/products.service";
import { getMovementsByProductId } from "@/lib/services/movements.service";
import { updateProductSchema } from "@/lib/validations/product.schema";
import { ZodError } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const product = getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const movements = getMovementsByProductId(productId);
  return NextResponse.json({ ...product, movements });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validated = updateProductSchema.parse(body);
    const updated = updateProduct(productId, validated);

    if (!updated) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const deleted = deleteProduct(productId);
  if (!deleted) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ message: "Producto eliminado correctamente" });
}
