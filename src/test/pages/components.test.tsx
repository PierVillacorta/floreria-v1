import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import Layout from "../../components/Layout";
import { Loading } from "../../components/Loading";
import NotFoundPage from "../../components/NotFoundPage";
import ProductCard from "../../components/ProductCard";
import { Dashboard } from "../../components/Dashboard";
import { RequireRole } from "../../components/RequireRole";
import { OrderStatusBadge } from "../../components/OrderStatusBadge";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useProductStore } from "../../store/productStore";
import { makeProduct, makeUser, renderWithRouter } from "../helpers";

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null });
  });

  it("sin sesión muestra enlaces públicos, Login y Registrarse", () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByRole("link", { name: "Categorías" })).toHaveAttribute("href", "/categories");
    expect(screen.getByRole("link", { name: "Ofertas" })).toHaveAttribute("href", "/offers");
    expect(screen.getByRole("link", { name: "Carrito" })).toHaveAttribute("href", "/cart");
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("link", { name: "Ordenes" })).not.toBeInTheDocument();
  });

  it("con CUSTOMER muestra saludo y Ordenes, y oculta Admin", () => {
    useAuthStore.setState({ user: makeUser({ role: "CUSTOMER", full_name: "Ana" }) });
    renderWithRouter(<Navbar />);
    expect(screen.getByText(/Ana/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ordenes" })).toHaveAttribute("href", "/my-orders");
    expect(screen.queryByRole("link", { name: "Admin" })).not.toBeInTheDocument();
  });

  it("con ADMIN y SELLER muestra acceso al panel", () => {
    useAuthStore.setState({ user: makeUser({ role: "ADMIN" }) });
    const { unmount } = renderWithRouter(<Navbar />);
    expect(screen.getByRole("link", { name: "Admin" })).toHaveAttribute("href", "/admin");
    unmount();

    useAuthStore.setState({ user: makeUser({ role: "SELLER" }) });
    renderWithRouter(<Navbar />);
    expect(screen.getByRole("link", { name: "Panel" })).toHaveAttribute("href", "/admin");
  });

  it("'Cerrar sesión' ejecuta logout", async () => {
    useAuthStore.setState({ user: makeUser({ role: "ADMIN" }), token: "t" });
    renderWithRouter(<Navbar />);
    await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(useAuthStore.getState().user).toBeNull();
  });
});

describe("RequireRole", () => {
  it("permite acceso a roles autorizados y redirige a los demás", () => {
    useAuthStore.setState({ user: makeUser({ role: "SELLER" }) });
    renderWithRouter(
      <Routes>
        <Route element={<RequireRole roles={["ADMIN"]} redirectTo="/admin" />}>
          <Route path="/admin/users" element={<p>usuarios-privado</p>} />
        </Route>
        <Route path="/admin" element={<p>panel-vendedor</p>} />
      </Routes>,
      "/admin/users",
    );
    expect(screen.getByText("panel-vendedor")).toBeInTheDocument();
    expect(screen.queryByText("usuarios-privado")).not.toBeInTheDocument();
  });
});

describe("Layout, Footer, Loading, NotFoundPage y OrderStatusBadge", () => {
  it("renderiza Layout completo y estados visuales", () => {
    renderWithRouter(
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<p>contenido-hijo</p>} />
        </Route>
      </Routes>,
    );
    expect(screen.getByText("contenido-hijo")).toBeInTheDocument();
    expect(screen.getByText("Contáctanos")).toBeInTheDocument();

    const { container } = render(<Loading />);
    expect(container.querySelector(".loading")).toBeInTheDocument();

    render(<OrderStatusBadge status="PAID" />);
    expect(screen.getByText("Pagada")).toBeInTheDocument();

    renderWithRouter(<NotFoundPage />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});

describe("ProductCard", () => {
  const product = makeProduct({
    product_id: 3,
    product_name: "Girasoles",
    price: 12000,
    stock: 1,
    description: "Ramo alegre",
  });

  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ cart: [] });
  });

  it("formatea precio en CLP, agrega al carrito y deshabilita al agotar stock", async () => {
    renderWithRouter(<ProductCard product={product} />);
    expect(screen.getByText("$12.000")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Girasoles");

    const btn = screen.getByRole("button", { name: "Agregar al carro" });
    await userEvent.click(btn);
    expect(useCartStore.getState().cart[0].amount).toBe(1);
    expect(screen.getByRole("button", { name: "Sin stock" })).toBeDisabled();
  });
});

describe("Dashboard", () => {
  it("muestra métricas y alerta de stock crítico", () => {
    useProductStore.setState({
      products: [
        makeProduct({ product_id: 1, product_name: "Rosas", stock: 2, critical_stock: 5 }),
        makeProduct({ product_id: 2, product_name: "Tulipanes", stock: 50, critical_stock: 5 }),
      ],
      categories: [{ category_id: 1, category_name: "Rosas" }],
      fetchProducts: vi.fn(),
      fetchCategories: vi.fn(),
    });
    renderWithRouter(<Dashboard />);
    expect(screen.getByText("Productos").previousElementSibling).toHaveTextContent("2");
    expect(screen.getByText("Stock crítico").previousElementSibling).toHaveTextContent("1");
    expect(screen.getByText("Stock: 2 (mínimo: 5)")).toBeInTheDocument();
  });
});