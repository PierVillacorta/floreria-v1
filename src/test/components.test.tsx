import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { Loading } from "../components/Loading";
import NotFoundPage from "../components/NotFoundPage";
import ProductCard from "../components/ProductCard";
import { Dashboard } from "../components/Dashboard";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useProductStore } from "../store/productStore";
import { renderWithRouter, makeProduct } from "./helpers";
import type { PublicUser } from "../types/types";

const userOf = (role: PublicUser["role"]): PublicUser => ({
  id: 1, full_name: "Ana", email: "a@gmail.com", role, account_status: "ACTIVE",
});

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null });
  });

  it("muestra los enlaces públicos de navegación", () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByRole("link", { name: "Categorías" })).toHaveAttribute("href", "/categories");
    expect(screen.getByRole("link", { name: "Ofertas" })).toHaveAttribute("href", "/offers");
    expect(screen.getByRole("link", { name: "Carrito" })).toHaveAttribute("href", "/cart");
    expect(screen.getByRole("link", { name: "Sobre Nosotros" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blogs");
  });

  it("sin sesión muestra Login y Registrarse, y no 'Cerrar sesión'", () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Registrarse" })).toHaveAttribute("href", "/register");
    expect(screen.queryByRole("button", { name: "Cerrar sesión" })).not.toBeInTheDocument();
  });

  it("con CUSTOMER saluda por nombre y oculta el enlace Admin", () => {
    useAuthStore.setState({ user: userOf("CUSTOMER") });
    renderWithRouter(<Navbar />);
    expect(screen.getByText(/Ana/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Admin" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
  });

  it("con ADMIN muestra el enlace /admin", () => {
    useAuthStore.setState({ user: userOf("ADMIN") });
    renderWithRouter(<Navbar />);
    expect(screen.getByRole("link", { name: "Admin" })).toHaveAttribute("href", "/admin");
  });

  it("'Cerrar sesión' ejecuta logout y vuelve a mostrar Login", async () => {
    useAuthStore.setState({ user: userOf("ADMIN"), token: "t" });
    renderWithRouter(<Navbar />);
    await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(useAuthStore.getState().user).toBeNull();
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
  });

  it("muestra el logo enlazado al inicio", () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByAltText("logo_floreria").closest("a")).toHaveAttribute("href", "/");
  });
});

describe("Footer", () => {
  it("muestra las tres secciones", () => {
    render(<Footer />);
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });
});

describe("Loading", () => {
  it("renderiza el indicador de carga", () => {
    const { container } = render(<Loading />);
    expect(container.querySelector(".loading")).toBeInTheDocument();
  });
});

describe("NotFoundPage", () => {
  it("muestra 404 y un enlace para volver al inicio", () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go Back Home" })).toHaveAttribute("href", "/");
  });
});

describe("Layout", () => {
  it("renderiza Navbar, el contenido de la ruta hija (Outlet) y Footer", () => {
    renderWithRouter(
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<p>contenido-hijo</p>} />
        </Route>
      </Routes>,
    );
    expect(screen.getByAltText("logo_floreria")).toBeInTheDocument();
    expect(screen.getByText("contenido-hijo")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });
});

describe("ProductCard", () => {
  const product = makeProduct({ product_id: 3, product_name: "Girasoles", price: 12000, description: "Ramo alegre" });

  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ cart: [] });
  });

  it("renderiza nombre, descripción, precio e imagen recibidos por props", () => {
    renderWithRouter(<ProductCard product={product} />);
    expect(screen.getByText("Girasoles")).toBeInTheDocument();
    expect(screen.getByText("Ramo alegre")).toBeInTheDocument();
    expect(screen.getByText("$12000")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", product.image_url);
  });

  it("el enlace 'Ver producto' apunta a /product/:id", () => {
    renderWithRouter(<ProductCard product={product} />);
    expect(screen.getByRole("link", { name: "Ver producto" })).toHaveAttribute("href", "/product/3");
  });

  it("'Agregar al carro' agrega el producto y suma al repetir", async () => {
    renderWithRouter(<ProductCard product={product} />);
    const btn = screen.getByRole("button", { name: "Agregar al carro" });
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(useCartStore.getState().cart).toHaveLength(1);
    expect(useCartStore.getState().cart[0].amount).toBe(2);
  });
});

describe("Dashboard", () => {
  const noFetch = { fetchProducts: vi.fn(), fetchCategories: vi.fn() };
  const productos = [
    makeProduct({ product_id: 1, product_name: "Rosas", stock: 2, critical_stock: 5 }),
    makeProduct({ product_id: 2, product_name: "Tulipanes", stock: 50, critical_stock: 5 }),
    makeProduct({ product_id: 3, product_name: "Lirios", stock: 9 }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useProductStore.setState({ products: [], categories: [], ...noFetch });
  });

  it("muestra las métricas: productos, categorías y stock crítico", () => {
    useProductStore.setState({
      products: productos,
      categories: [{ category_id: 1, category_name: "Rosas" }, { category_id: 2, category_name: "Otras" }],
    });
    renderWithRouter(<Dashboard />);
    expect(screen.getByText("Productos").previousElementSibling).toHaveTextContent("3");
    expect(screen.getByText("Categorías").previousElementSibling).toHaveTextContent("2");
    expect(screen.getByText("Stock crítico").previousElementSibling).toHaveTextContent("1");
  });

  it("lista solo los productos con stock crítico", () => {
    useProductStore.setState({ products: productos, categories: [{ category_id: 1, category_name: "x" }] });
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/Productos con stock crítico/)).toBeInTheDocument();
    expect(screen.getByText("Stock: 2 (mínimo: 5)")).toBeInTheDocument();
    expect(screen.queryByText("Lirios")).not.toBeInTheDocument();
  });

  it("no muestra la alerta si no hay productos críticos", () => {
    useProductStore.setState({ products: [productos[1]], categories: [{ category_id: 1, category_name: "x" }] });
    renderWithRouter(<Dashboard />);
    expect(screen.queryByText(/Productos con stock crítico/)).not.toBeInTheDocument();
  });

  it("pide productos y categorías al montar si están vacíos", () => {
    renderWithRouter(<Dashboard />);
    expect(noFetch.fetchProducts).toHaveBeenCalledTimes(1);
    expect(noFetch.fetchCategories).toHaveBeenCalledTimes(1);
  });
});