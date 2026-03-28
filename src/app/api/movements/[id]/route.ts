import { NextResponse } from "next/server";
import { deleteMovement } from "@/lib/services/movements.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const movementId = parseInt(id, 10);

  if (isNaN(movementId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const deleted = deleteMovement(movementId);
  if (!deleted) {
    return NextResponse.json({ error: "Movimiento no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ message: "Movimiento eliminado correctamente" });
}
