import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { About } from "../pages/About";
import { BlogsPage } from "../pages/BlogPage";
import { BlogDetail } from "../pages/BlogDetail";
import { Home } from "../pages/Home";
import { InfoProduct } from "../pages/InfoProduct";
import { Offers } from "../pages/Offers";
import { Categories } from "../pages/Categories";
import { blogs } from "../data/blogs";
import { useCartStore } from "../store/cartStore";
import { useProductStore } from "../store/productStore";
import { renderWithRouter, renderAtRoute, makeProduct, jsonResponse } from "./helpers";

const noFetch = () => ({ fetchProducts: vi.fn().mockResolvedValue(undefined), fetchCategories: vi.fn().mockResolvedValue(undefined) });
const resetProducts = () => {
  localStorage.clear();
  useCartStore.setState({ cart: [] });
  useProductStore.setState({ products: [], categories: [], loading: false, error: null, ...noFetch() });
};

describe("Home", () => {
  const { fetchProducts: fetchReal } = useProductStore.getInitialState();
  beforeEach(resetProducts);
  afterEach(() => vi.restoreAllMocks());

  it("renderiza una tarjeta por cada producto", () => {
    useProductStore.setState({
      products: [makeProduct({ product_id: 1, product_name: "Rosas" }), makeProduct({ product_id: 2, product_name: "Tulipanes" })],
    });
    renderWithRouter(<Home />);
    expect(screen.getByText("Rosas")).toBeInTheDocument();
    expect(screen.getByText("Tulipanes")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Agregar al carro" })).toHaveLength(2);
  });

  it("no vuelve a pedir productos si ya hay cargados", () => {
    const f = vi.fn();
    useProductStore.setState({ products: [makeProduct()], fetchProducts: f });
    renderWithRouter(<Home />);
    expect(f).not.toHaveBeenCalled();
  });

  it("muestra el indicador de carga", () => {
    useProductStore.setState({ loading: true });
    const { container } = renderWithRouter(<Home />);
    expect(container.querySelector(".loading")).toBeInTheDocument();
  });

  it("muestra el mensaje de error", () => {
    useProductStore.setState({ error: "No se pudieron cargar los productos" });
    renderWithRouter(<Home />);
    expect(screen.getByText("No se pudieron cargar los productos")).toBeInTheDocument();
  });

  it("al montar con lista vacía pide al backend y pinta los productos", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ items: [makeProduct({ product_id: 9, product_name: "Orquídea" })] }));
    useProductStore.setState({ fetchProducts: fetchReal });
    renderWithRouter(<Home />);
    expect(await screen.findByText("Orquídea")).toBeInTheDocument();
  });
});

describe("App (página de inicio)", () => {
  beforeEach(resetProducts);

  it("muestra el mensaje de bienvenida y los productos", () => {
    useProductStore.setState({ products: [makeProduct({ product_name: "Rosas" })] });
    renderWithRouter(<App />);
    expect(screen.getByText("BIENVENIDO")).toBeInTheDocument();
    expect(screen.getByText("FLORERÍA")).toBeInTheDocument();
    expect(screen.getByText("Rosas")).toBeInTheDocument();
  });
});

describe("About", () => {
  it("muestra quiénes somos, visión y misión", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: "¿QUIÉNES SOMOS?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "VISIÓN" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "MISIÓN" })).toBeInTheDocument();
  });
});

describe("BlogsPage", () => {
  it("lista todos los blogs con enlace a su detalle", () => {
    renderWithRouter(<BlogsPage />);
    expect(screen.getAllByRole("article")).toHaveLength(blogs.length);
    blogs.forEach((b) => expect(screen.getByRole("heading", { name: b.title })).toBeInTheDocument());
    expect(screen.getAllByRole("link", { name: /Leer más/ })[0]).toHaveAttribute("href", `/blogs/${blogs[0].id}`);
  });
});

describe("BlogDetail", () => {
  it("muestra el título y el enlace de volver cuando el blog existe", () => {
    renderAtRoute("/blogs/:id", <BlogDetail />, `/blogs/${blogs[0].id}`);
    expect(screen.getByRole("heading", { name: blogs[0].title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Volver al blog/ })).toHaveAttribute("href", "/blogs");
  });

  it("redirige a /blogs si el id no existe", () => {
    renderAtRoute("/blogs/:id", <BlogDetail />, "/blogs/9999");
    expect(screen.getByTestId("location")).toHaveTextContent("/blogs");
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });
});

describe("InfoProduct", () => {
  const rosas = makeProduct({ product_id: 3, product_name: "Rosas", price: 15000, stock: 2, description: "Ramo clásico" });
  const abrir = () => renderAtRoute("/product/:product_id", <InfoProduct />, "/product/3");

  beforeEach(resetProducts);

  it("muestra el indicador de carga mientras loading", () => {
    useProductStore.setState({ loading: true });
    const { container } = abrir();
    expect(container.querySelector(".loading")).toBeInTheDocument();
  });

  it("muestra los datos del producto y el stock disponible", () => {
    useProductStore.setState({ products: [rosas] });
    abrir();
    expect(screen.getByRole("heading", { name: "Rosas" })).toBeInTheDocument();
    expect(screen.getByText("Ramo clásico")).toBeInTheDocument();
    expect(screen.getByText("$15.000")).toBeInTheDocument();
    expect(screen.getByText("2 disponibles")).toBeInTheDocument();
  });

  it("al agregar al carrito baja el stock disponible hasta agotarse", async () => {
    useProductStore.setState({ products: [rosas] });
    abrir();
    const btn = screen.getByRole("button", { name: "AGREGAR AL CARRITO" });
    await userEvent.click(btn);
    expect(screen.getByText("1 disponibles")).toBeInTheDocument();
    await userEvent.click(btn);
    expect(screen.getByText("Producto agotado")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "AGOTADO" })).toBeDisabled();
    expect(useCartStore.getState().cart[0].amount).toBe(2);
  });

  it("producto sin stock aparece agotado y deshabilitado", () => {
    useProductStore.setState({ products: [{ ...rosas, stock: 0 }] });
    abrir();
    expect(screen.getByRole("button", { name: "AGOTADO" })).toBeDisabled();
  });

  it("redirige a /not-found si el producto no existe", () => {
    useProductStore.setState({ products: [makeProduct({ product_id: 99 })] });
    abrir();
    expect(screen.getByTestId("location")).toHaveTextContent("/not-found");
  });
});

describe("Offers", () => {
  const barato = makeProduct({ product_id: 1, product_name: "Margaritas", price: 10000 });
  const limite = makeProduct({ product_id: 2, product_name: "Claveles", price: 25000 });
  const caro = makeProduct({ product_id: 3, product_name: "Orquídea Premium", price: 30000 });

  beforeEach(resetProducts);

  it("muestra solo productos con precio ≤ $25.000", () => {
    useProductStore.setState({ products: [barato, limite, caro] });
    renderWithRouter(<Offers />);
    expect(screen.getByText("Margaritas")).toBeInTheDocument();
    expect(screen.getByText("Claveles")).toBeInTheDocument();
    expect(screen.queryByText("Orquídea Premium")).not.toBeInTheDocument();
    expect(screen.getByText(/hasta \$25\.000/)).toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay ofertas", () => {
    useProductStore.setState({ products: [caro] });
    renderWithRouter(<Offers />);
    expect(screen.getByText("No hay ofertas disponibles")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver todos los productos" })).toHaveAttribute("href", "/");
  });

  it("muestra carga y error", () => {
    useProductStore.setState({ loading: true });
    const { container, unmount } = renderWithRouter(<Offers />);
    expect(container.querySelector(".loading")).toBeInTheDocument();
    unmount();
    useProductStore.setState({ loading: false, error: "Falló" });
    renderWithRouter(<Offers />);
    expect(screen.getByText("Falló")).toBeInTheDocument();
  });

  it("'Agregar' añade el producto al carrito", async () => {
    useProductStore.setState({ products: [barato] });
    renderWithRouter(<Offers />);
    await userEvent.click(screen.getByRole("button", { name: "Agregar" }));
    expect(useCartStore.getState().cart[0].product_id).toBe(1);
  });
});

describe("Categories", () => {
  const cats = [
    { category_id: 1, category_name: "Rosas" },
    { category_id: 2, category_name: "Tulipanes" },
  ];
  const prods = [
    makeProduct({ product_id: 1, product_name: "Rosa roja", category_id: 1 }),
    makeProduct({ product_id: 2, product_name: "Rosa blanca", category_id: 1 }),
    makeProduct({ product_id: 3, product_name: "Tulipán amarillo", category_id: 2 }),
  ];

  beforeEach(resetProducts);

  it("selecciona la primera categoría y filtra sus productos", () => {
    useProductStore.setState({ categories: cats, products: prods });
    renderWithRouter(<Categories />);
    expect(screen.getByText("(2 productos)")).toBeInTheDocument();
    expect(screen.getByText("Rosa roja")).toBeInTheDocument();
    expect(screen.queryByText("Tulipán amarillo")).not.toBeInTheDocument();
  });

  it("al hacer clic en otra categoría cambia el listado", async () => {
    useProductStore.setState({ categories: cats, products: prods });
    renderWithRouter(<Categories />);
    await userEvent.click(screen.getByRole("button", { name: "Tulipanes" }));
    expect(screen.getByText("Tulipán amarillo")).toBeInTheDocument();
    expect(screen.queryByText("Rosa roja")).not.toBeInTheDocument();
    expect(screen.getByText("(1 productos)")).toBeInTheDocument();
  });

  it("muestra mensaje si la categoría no tiene productos", () => {
    useProductStore.setState({ categories: cats, products: [prods[2]] });
    renderWithRouter(<Categories />);
    expect(screen.getByText("No hay productos en esta categoría.")).toBeInTheDocument();
  });

  it("'Agregar' añade el producto al carrito", async () => {
    useProductStore.setState({ categories: cats, products: prods });
    renderWithRouter(<Categories />);
    await userEvent.click(screen.getAllByRole("button", { name: "Agregar" })[0]);
    expect(useCartStore.getState().cart[0].product_id).toBe(1);
  });

  it("muestra carga mientras loading", () => {
    useProductStore.setState({ loading: true });
    const { container } = renderWithRouter(<Categories />);
    expect(container.querySelector(".loading")).toBeInTheDocument();
  });
});