import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import type {
  CartProduct,
  Order,
  OrderSummary,
  Product,
  PublicUser,
} from "../types/types";

const LocationProbe = () => (
  <span data-testid="location">{useLocation().pathname}</span>
);

type Entry = string | { pathname: string; state?: unknown };

export const renderWithRouter = (ui: ReactElement, entry: Entry = "/") =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      {ui}
      <LocationProbe />
    </MemoryRouter>,
  );

export const renderAtRoute = (path: string, element: ReactElement, url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path={path} element={element} />
        <Route path="*" element={<span>otra-ruta</span>} />
      </Routes>
      <LocationProbe />
    </MemoryRouter>,
  );

export const makeUser = (over: Partial<PublicUser> = {}): PublicUser => ({
  user_id: 1,
  full_name: "Ana Pérez",
  email: "ana@gmail.com",
  role: "CUSTOMER",
  account_status: "ACTIVE",
  address: "Av. Providencia 1234",
  region: "Región Metropolitana",
  commune: "Providencia",
  ...over,
});

export const makeProduct = (over: Partial<Product> = {}): Product => ({
  product_id: 1,
  product_code: "FL-001",
  product_name: "Rosas Rojas",
  image_url: "data:image/gif;base64,R0lGODlhAQABAAAAACw=",
  stock: 10,
  price: 15000,
  description: "Ramo de 12 rosas",
  category_id: 1,
  ...over,
});

export const makeCartProduct = (over: Partial<CartProduct> = {}): CartProduct => ({
  ...makeProduct(over),
  amount: 1,
  ...over,
});

export const makeOrderSummary = (over: Partial<OrderSummary> = {}): OrderSummary => ({
  order_id: 101,
  status: "PAID",
  total: 20000,
  created_at: "2026-10-15T14:30:00Z",
  customer_name: "Ana Pérez",
  customer_email: "ana@gmail.com",
  ...over,
});

export const makeOrder = (over: Partial<Order> = {}): Order => ({
  ...makeOrderSummary(over),
  address: "Av. Providencia 1234",
  region: "Región Metropolitana",
  commune: "Providencia",
  notes: "Dejar en conserjería",
  items: [
    {
      product_id: 1,
      product_name: "Rosas Rojas",
      unit_price: 10000,
      quantity: 2,
      subtotal: 20000,
    },
  ],
  ...over,
});

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const emptyResponse = (status = 204) => new Response(null, { status });