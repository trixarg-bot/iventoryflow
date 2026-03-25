export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
  created_at: string;
}

export interface Movement {
  id: number;
  product_id: number;
  type: "in" | "out";
  quantity: number;
  notes: string | null;
  created_at: string;
}

export interface MovementWithProduct extends Movement {
  product_name: string;
}

export interface ProductWithStock extends Product {
  stock: number;
}
