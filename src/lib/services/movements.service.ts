import { getDb } from "@/lib/db";
import type { Movement, MovementWithProduct } from "@/lib/types";
import type { MovementInput } from "@/lib/validations/movement.schema";

export function getAllMovements(): MovementWithProduct[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT m.*, p.name AS product_name
       FROM movements m
       JOIN products p ON p.id = m.product_id
       ORDER BY m.created_at DESC`
    )
    .all() as MovementWithProduct[];
}

export function getMovementsByProductId(productId: number): Movement[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM movements
       WHERE product_id = ?
       ORDER BY created_at DESC`
    )
    .all(productId) as Movement[];
}

export function getStockForProduct(productId: number): number {
  const db = getDb();
  const result = db
    .prepare(
      `SELECT
         COALESCE(SUM(CASE WHEN type = 'in'  THEN quantity ELSE 0 END), 0)
       - COALESCE(SUM(CASE WHEN type = 'out' THEN quantity ELSE 0 END), 0) AS stock
       FROM movements
       WHERE product_id = ?`
    )
    .get(productId) as { stock: number };
  return result.stock;
}

export function createMovement(data: MovementInput): Movement {
  const db = getDb();

  if (data.type === "out") {
    const currentStock = getStockForProduct(data.product_id);
    if (data.quantity > currentStock) {
      throw new Error(
        `Stock insuficiente. Stock actual: ${currentStock}, cantidad solicitada: ${data.quantity}`
      );
    }
  }

  const result = db
    .prepare(
      `INSERT INTO movements (product_id, type, quantity, notes)
       VALUES (@product_id, @type, @quantity, @notes)`
    )
    .run({
      product_id: data.product_id,
      type: data.type,
      quantity: data.quantity,
      notes: data.notes ?? null,
    });

  return db
    .prepare("SELECT * FROM movements WHERE id = ?")
    .get(result.lastInsertRowid) as Movement;
}

export function deleteMovement(id: number): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM movements WHERE id = ?").run(id);
  return result.changes > 0;
}
