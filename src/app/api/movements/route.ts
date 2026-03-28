import { NextResponse } from "next/server";
import { getAllMovements, createMovement } from "@/lib/services/movements.service";
import { movementSchema } from "@/lib/validations/movement.schema";
import { ZodError } from "zod";

export async function GET() {
  try {
    const movements = getAllMovements();
    return NextResponse.json(movements);
  } catch {
    return NextResponse.json({ error: "Error al obtener movimientos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = movementSchema.parse(body);
    const movement = createMovement(validated);
    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.issues }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    return NextResponse.json({ error: "Error al crear el movimiento" }, { status: 500 });
  }
}
