import { NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/services/products.service";
import { productSchema } from "@/lib/validations/product.schema";
import { ZodError } from "zod";

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = productSchema.parse(body);
    const product = createProduct(validated);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al crear el producto" }, { status: 500 });
  }
}
