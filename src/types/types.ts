export type Product = {
  id: number;
  name: string;
  img: string;
  stock: number;
  precio: number;
  descripcion: string;
  categoria: String;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  status: "active" | "inactive";
};

export type CartProduct = Product & {
    amount:number
}

