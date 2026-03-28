import { getDb } from "@/lib/db";
import type { Product, ProductWithStock } from "@/lib/types";
import type { ProductInput, UpdateProductInput } from "@/lib/validations/product.schema";

export function getAllProducts(): ProductWithStock[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT
         p.*,
         COALESCE(SUM(CASE WHEN m.type = 'in'  THEN m.quantity ELSE 0 END), 0)
       - COALESCE(SUM(CASE WHEN m.type = 'out' THEN m.quantity ELSE 0 END), 0) AS stock
       FROM products p
       LEFT JOIN movements m ON m.product_id = p.id
       GROUP BY p.id
       ORDER BY p.created_at DESC`
    )
    .all() as ProductWithStock[];
}

export function getProductById(id: number): ProductWithStock | undefined {
  const db = getDb();
  return db
    .prepare(
      `SELECT
         p.*,
         COALESCE(SUM(CASE WHEN m.type = 'in'  THEN m.quantity ELSE 0 END), 0)
       - COALESCE(SUM(CASE WHEN m.type = 'out' THEN m.quantity ELSE 0 END), 0) AS stock
       FROM products p
       LEFT JOIN movements m ON m.product_id = p.id
       WHERE p.id = ?
       GROUP BY p.id`
    )
    .get(id) as ProductWithStock | undefined;
}

export function createProduct(data: ProductInput): Product {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO products (name, description, price, active)
       VALUES (@name, @description, @price, @active)`
    )
    .run({
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      active: data.active ? 1 : 0,
    });

  return getProductById(result.lastInsertRowid as number) as Product;
}

export function updateProduct(id: number, data: UpdateProductInput): Product | undefined {
  const db = getDb();
  const existing = getProductById(id);
  if (!existing) return undefined;

  db.prepare(
    `UPDATE products
     SET name        = COALESCE(@name,        name),
         description = COALESCE(@description, description),
         price       = COALESCE(@price,       price),
         active      = COALESCE(@active,      active)
     WHERE id = @id`
  ).run({
    id,
    name: data.name ?? null,
    description: data.description ?? null,
    price: data.price ?? null,
    active: data.active !== undefined ? (data.active ? 1 : 0) : null,
  });

  return getProductById(id);
}

export function deleteProduct(id: number): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return result.changes > 0;
}
