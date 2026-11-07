export type UserRole = "ADMIN" | "CUSTOMER" | "SELLER";
export type Product = {
    product_id: number;
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
export type ProductForm = {
  product_name: string;
  price: number;
  stock: number;
  description: string;
  critical_stock: number;
  image_url: string;
  category_id: number;
};

export type UserRow = {
  user_id: number;
  full_name: string;
  email: string;
  role: string;
  account_status: string;
};


export type PublicUser = Omit<User, "password_hash">;
export type NewProduct = Omit<Product,"product_id">
export type CartProduct = Product & {amount: number;};
