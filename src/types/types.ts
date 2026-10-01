export type Product = {
  id: number;
  product_name: string;
  img_url: string;
  stock: number;
  precio: number;
  description: string;
  category_id: string;
  category_stock?: number;
};

export type Category = {
  category_id: number;
  category_name: string;
};
export type UserRole = "ADMIN" | "CUSTOMER" | "SELLER";

export type User = {
  id: number;
  full_name: string;
  last_name?: string;
  run?: string;
  email: string;
  password_hash: string;
  role: UserRole;
  account_status: "ACTIVE" | "INACTIVE";
  birth_date?: string;     
  address?: string;        
  region?: string;         
  commune?: string;       
  phone?: string;  
};

export type PublicUser = Omit<User, "password_hash">;

export type CartProduct = Product & {
  amount: number;
};
