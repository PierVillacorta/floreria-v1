export type UserRole = "ADMIN" | "CUSTOMER" | "SELLER";

export type Product = {
  product_id: number;
  product_code: string;
  product_name: string;
  image_url: string;
  stock: number;
  price: number;
  description: string;
  category_id: number;
  critical_stock?: number;
};

export type Category = {
  category_id: number;
  category_name: string;
};

// Lo que la API devuelve de un usuario
export type User = {
  user_id: number;
  full_name: string;
  email: string;
  role: UserRole;
  account_status: "ACTIVE" | "INACTIVE";
  address: string | null;
  region: string | null;
  commune: string | null;
};

export type PublicUser = User;
export type NewUserPayload = Omit<User,"user_id" | "account_status"> &{
  password:string;
}
export type RegisterData = Omit<NewUserPayload, "role">;

export type ProductForm = {
  product_code: string;
  product_name: string;
  price: number;
  stock: number;
  description: string;
  critical_stock: number;
  image_url: string;
  category_id: number;
};


// Fila del listado de usuarios del admin
export type UserRow = {
  user_id: number;
  full_name: string;
  email: string;
  role: string;
  account_status: string;
};

export type NewProduct = Omit<Product, "product_id">;
export type CartProduct = Product & { amount: number };

//  Ordenes
export type OrderStatus = "PAID" | "FAILED";

export type OrderItem = {
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
};


export type OrderSummary = {
  order_id: number;
  status: OrderStatus;
  total: number;
  created_at: string;
  customer_name: string;
  customer_email: string;
};

export type Order = OrderSummary & {
  address: string;
  region: string;
  commune: string;
  notes: string | null;
  items: OrderItem[];
};

export type CreateOrderPayload = {
  customer_name: string;
  customer_email: string;
  address: string;
  region: string;
  commune: string;
  notes: string;
  items: { product_id: number; quantity: number }[];
};
