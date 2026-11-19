import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";
import { About } from "../../pages/About";
import { BlogsPage } from "../../pages/BlogPage";
import { BlogDetail } from "../../pages/BlogDetail";
import { Home } from "../../pages/Home";
import { InfoProduct } from "../../pages/InfoProduct";
import { Offers } from "../../pages/Offers";
import { Categories } from "../../pages/Categories";
import { blogs } from "../../data/blogs";
import { useCartStore } from "../../store/cartStore";
import { useProductStore } from "../../store/productStore";
import { jsonResponse, makeProduct, renderAtRoute, renderWithRouter } from "../helpers";

const resetProducts = () => {
  localStorage.clear();
  useCartStore.setState({ cart: [] });
  useProductStore.setState({
    products: [],
    categories: [],
    loading: false,
    error: null,
    fetchProducts: vi.fn().mockResolvedValue(undefined),
    fetchCategories: vi.fn().mockResolvedValue(undefined),
  });
};

describe("Home y App", () => {
  const { fetchProducts: fetchReal } = useProductStore.getInitialState();
  beforeEach(resetProducts);
  afterEach(() => vi.restoreAllMocks());

  it("al montar con lista vacía pide productos al backend", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse([makeProduct({ product_id: 9, product_name: "Orquídea" })]),
    );
    useProductStore.setState({ fetchProducts: fetchReal });
    renderWithRouter(<App />);
    expect(screen.getByText("BIENVENIDO")).toBeInTheDocument();
    expect(await screen.findByText("Orquídea")).toBeInTheDocument();
  });

  it("muestra error cuando falla la carga", () => {
    useProductStore.setState({ error: "Error de conexión con el servidor" });
    renderWithRouter(<Home />);
    expect(screen.getByText("Error de conexión con el servidor")).toBeInTheDocument();
  });
});

describe("About y Blogs", () => {
  it("renderiza About", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: "¿QUIÉNES SOMOS?" })).toBeInTheDocument();
  });

  it("renderiza BlogsPage", () => {
    renderWithRouter(<BlogsPage />);
    expect(screen.getAllByRole("article")).toHaveLength(blogs.length);
  });

  it("renderiza BlogDetail y redirige si el id no existe", () => {
    const { unmount } = renderAtRoute("/blogs/:id", <BlogDetail />, `/blogs/${blogs[0].id}`);
    expect(screen.getByRole("heading", { name: blogs[0].title })).toBeInTheDocument();
    unmount();

    renderAtRoute("/blogs/:id", <BlogDetail />, "/blogs/9999");
    expect(screen.getByTestId("location")).toHaveTextContent("/blogs");
  });
});

describe("InfoProduct", () => {
  const rosas = makeProduct({ product_id: 3, product_name: "Rosas", price: 15000, stock: 2 });
  beforeEach(resetProducts);

  it("descuenta stock disponible hasta agotarse", async () => {
    useProductStore.setState({ products: [rosas] });
    renderAtRoute("/product/:product_id", <InfoProduct />, "/product/3");
    const btn = screen.getByRole("button", { name: "AGREGAR AL CARRITO" });
    await userEvent.click(btn);
    expect(screen.getByText("1 disponibles")).toBeInTheDocument();
    await userEvent.click(btn);
    expect(screen.getByRole("button", { name: "AGOTADO" })).toBeDisabled();
  });

  it("redirige a /not-found si el producto no existe", () => {
    useProductStore.setState({ products: [rosas] });
    renderAtRoute("/product/:product_id", <InfoProduct />, "/product/99");
    expect(screen.getByTestId("location")).toHaveTextContent("/not-found");
  });
});

describe("Offers y Categories", () => {
  beforeEach(resetProducts);

  it("Offers filtra productos <= $25.000", () => {
    useProductStore.setState({
      products: [
        makeProduct({ product_id: 1, product_name: "Margaritas", price: 10000 }),
        makeProduct({ product_id: 2, product_name: "Orquídea Premium", price: 30000 }),
      ],
    });
    renderWithRouter(<Offers />);
    expect(screen.getByText("Margaritas")).toBeInTheDocument();
    expect(screen.queryByText("Orquídea Premium")).not.toBeInTheDocument();
  });

  it("Categories filtra por pestaña seleccionada", async () => {
    useProductStore.setState({
      categories: [
        { category_id: 1, category_name: "Rosas" },
        { category_id: 2, category_name: "Tulipanes" },
      ],
      products: [
        makeProduct({ product_id: 1, product_name: "Rosa roja", category_id: 1 }),
        makeProduct({ product_id: 2, product_name: "Tulipán amarillo", category_id: 2 }),
      ],
    });
    renderWithRouter(<Categories />);
    expect(screen.getByText("Rosa roja")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Tulipanes" }));
    expect(screen.getByText("Tulipán amarillo")).toBeInTheDocument();
    expect(screen.queryByText("Rosa roja")).not.toBeInTheDocument();
  });
});