import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "../../pages/admin/AdminLayaout";
import { AdminHome } from "../../pages/admin/AdminHome";
import { AdminProducts } from "../../pages/admin/AdminProducts";
import { AdminUsers } from "../../pages/admin/AdminUsers";
import { AdminCategories } from "../../pages/admin/AdminCategories";
import { AdminOrders } from "../../pages/admin/AdminOrders";
import { useAuthStore } from "../../store/authStore";
import { useProductStore } from "../../store/productStore";
import { useUserStore } from "../../store/usersStore";
import { useOrderStore } from "../../store/orderStore";
import { makeOrderSummary, makeProduct, makeUser, renderWithRouter } from "../helpers";

const admin = makeUser({ user_id: 1, full_name: "Jefa Admin", role: "ADMIN" });
const seller = makeUser({ user_id: 2, full_name: "Beto Vendedor", role: "SELLER" });

describe("AdminLayout y AdminHome", () => {
  beforeEach(() => useAuthStore.setState({ user: null, token: null }));

  it("bloquea a CUSTOMER y muestra menú según rol", () => {
    useAuthStore.setState({ user: makeUser({ role: "CUSTOMER" }) });
    const { unmount } = renderWithRouter(
      <Routes>
        <Route path="/admin" element={<AdminLayout />} />
      </Routes>,
      "/admin",
    );
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    unmount();

    useAuthStore.setState({ user: seller });
    renderWithRouter(
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="orders" element={<p>vista-ordenes</p>} />
        </Route>
      </Routes>,
      "/admin",
    );
    expect(screen.getByRole("heading", { name: "Vendedor" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Usuarios/ })).not.toBeInTheDocument();
    expect(screen.getByText("vista-ordenes")).toBeInTheDocument();
  });
});

describe("AdminProducts", () => {
  const cats = [{ category_id: 1, category_name: "Rosas" }];
  const prod = makeProduct({ product_id: 1, product_code: "FL-01", product_name: "Rosas Rojas", stock: 2, critical_stock: 5 });

  beforeEach(() => {
    useAuthStore.setState({ user: admin });
    useProductStore.setState({
      products: [prod],
      categories: cats,
      loading: false,
      error: null,
      fetchProducts: vi.fn(),
      fetchCategories: vi.fn(),
      createProduct: vi.fn().mockResolvedValue({ success: true, message: "Producto creado" }),
      updateProduct: vi.fn().mockResolvedValue({ success: true, message: "Producto actualizado" }),
      deleteProduct: vi.fn().mockResolvedValue({ success: true, message: "Producto eliminado" }),
    });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("crea un producto con código y nombre desde el modal", async () => {
    const createMock = useProductStore.getState().createProduct;
    renderWithRouter(<AdminProducts />);

    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));
    await userEvent.type(screen.getByLabelText("Código *"), "FL-99");
    await userEvent.type(screen.getByPlaceholderText("Nombre del producto"), "Lirios");
    await userEvent.click(screen.getByRole("button", { name: "Crear producto", hidden: true }));
    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));
    await userEvent.type(screen.getByLabelText("Código *"), "FL-99");
    await userEvent.type(screen.getByPlaceholderText("Nombre del producto"), "Lirios");
    await userEvent.type(screen.getByLabelText("Precio *"), "15000");
    await userEvent.type(screen.getByLabelText("Stock *"), "10");
    await userEvent.click(screen.getByRole("button", { name: "Crear producto", hidden: true }));

    await waitFor(() =>
      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({
          product_code: "FL-99",
          product_name: "Lirios",
          price: 15000,
          stock: 10,
          category_id: 1,
        }),
      ),
    );

    await waitFor(() =>
      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({ product_code: "FL-99", product_name: "Lirios", category_id: 1 }),
      ),
    );
  });
});

describe("AdminCategories", () => {
  it("crea categorías usando createCategory del store", async () => {
    const createCategory = vi.fn().mockResolvedValue({ success: true, message: "Categoría creada" });
    useProductStore.setState({
      categories: [{ category_id: 1, category_name: "Rosas" }],
      loading: false,
      fetchCategories: vi.fn(),
      createCategory,
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
    });
    renderWithRouter(<AdminCategories />);

    await userEvent.type(screen.getByPlaceholderText("Ej: Plantas de interior"), "Orquídeas");
    await userEvent.click(screen.getByRole("button", { name: "CREAR CATEGORÍA" }));

    expect(createCategory).toHaveBeenCalledWith("Orquídeas");
    expect(await screen.findByText("Categoría creada")).toBeInTheDocument();
  });
});

describe("AdminUsers", () => {
  it("oculta ADMIN de la tabla y crea un usuario nuevo", async () => {
    const createUser = vi.fn().mockResolvedValue({ success: true, message: "OK" });
    useUserStore.setState({
      users: [
        { user_id: 1, full_name: "Jefa", email: "jefa@floreria.com", role: "ADMIN", account_status: "ACTIVE" },
        { user_id: 2, full_name: "Ana", email: "ana@gmail.com", role: "CUSTOMER", account_status: "ACTIVE" },
      ],
      loading: false,
      error: null,
      fetchUsers: vi.fn(),
      createUser,
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
    });
    renderWithRouter(<AdminUsers />);

    expect(screen.queryByText("Jefa")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo usuario" }));
    await userEvent.type(screen.getByPlaceholderText("Nombre"), "Caro");
    await userEvent.type(screen.getByPlaceholderText("vendedor@floreria.com"), "caro@floreria.com");
    await userEvent.type(screen.getByPlaceholderText("Ej: vend1234"), "vend1234");
    await userEvent.type(screen.getByPlaceholderText("Av. Principal 123"), "Calle 1");
    await userEvent.type(screen.getByPlaceholderText("Metropolitana"), "RM");
    await userEvent.type(screen.getByPlaceholderText("Santiago"), "Santiago");
    await userEvent.click(screen.getByRole("button", { name: "Crear Usuario", hidden: true }));

    await waitFor(() => expect(createUser).toHaveBeenCalledTimes(1));
  });
});

describe("AdminOrders", () => {
  it("filtra órdenes y suma solo las pagadas en el total vendido", async () => {
    useOrderStore.setState({
      orders: [
        makeOrderSummary({ order_id: 1, status: "PAID", total: 25000, customer_name: "Ana" }),
        makeOrderSummary({ order_id: 2, status: "FAILED", total: 40000, customer_name: "Luis" }),
      ],
      loading: false,
      error: null,
      fetchAllOrders: vi.fn(),
    });
    renderWithRouter(<AdminOrders />);

    expect(screen.getAllByText("$25.000")).toHaveLength(2);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "PAID" } });
    expect(screen.queryByText("Luis")).not.toBeInTheDocument();
  });
});