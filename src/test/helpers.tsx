import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import type { CartProduct, Product } from "../types/types";

/** Muestra la ruta actual para poder comprobar navegaciones (navigate / <Navigate />). */
const LocationProbe = () => <span data-testid="location">{useLocation().pathname}</span>;

type Entry = string | { pathname: string; state?: unknown };

/** Renderiza un componente dentro de un MemoryRouter (necesario para <Link>, useNavigate, etc.). */
export const renderWithRouter = (ui: ReactElement, entry: Entry = "/") =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      {ui}
      <LocationProbe />
    </MemoryRouter>,
  );

/** Renderiza un componente en una ruta con parámetros, ej: renderAtRoute("/product/:product_id", <InfoProduct />, "/product/3") */
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

export const makeProduct = (over: Partial<Product> = {}): Product => ({
  product_id: 1,
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

/** Respuesta JSON falsa para mockear fetch */
export const jsonResponse = (body: unknown, ok = true) =>
  new Response(JSON.stringify(body), { status: ok ? 200 : 400, headers: { "Content-Type": "application/json" } });