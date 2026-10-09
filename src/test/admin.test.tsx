import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "../pages/admin/AdminLayaout";
import { AdminProducts } from "../pages/admin/AdminProducts";
import { AdminUsers } from "../pages/admin/AdminUsers";
import { AdminCategories } from "../pages/admin/AdminCategories";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import { useUserStore } from "../store/usersStore";
import { renderWithRouter, makeProduct, jsonResponse } from "./helpers";

const admin = { id: 1, full_name: "Jefa Admin", email: "admin@floreria.com", role: "ADMIN" as const, account_status: "ACTIVE" as const };

describe("AdminLayout", () => {
  const abrir = () =>
    renderWithRouter(
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<p>contenido-admin</p>} />
        </Route>
      </Routes>,
      "/admin",
    );

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null });
  });

  it("sin sesión redirige a '/'", () => {
    abrir();
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    expect(screen.queryByText("contenido-admin")).not.toBeInTheDocument();
  });

  it("un CUSTOMER no puede entrar al panel", () => {
    useAuthStore.setState({ user: { ...admin, role: "CUSTOMER" } });
    abrir();
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
  });

  it("un ADMIN ve el menú lateral, su nombre y el contenido hijo", () => {
    useAuthStore.setState({ user: admin });
    abrir();
    expect(screen.getByRole("heading", { name: "Administrador" })).toBeInTheDocument();
    expect(screen.getByText("Jefa Admin")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dashboard/ })).toHaveAttribute("href", "/admin");
    expect(screen.getByRole("link", { name: /Usuarios/ })).toHaveAttribute("href", "/admin/users");
    expect(screen.getByRole("link", { name: /Productos/ })).toHaveAttribute("href", "/admin/products");
    expect(screen.getByRole("link", { name: /Categorías/ })).toHaveAttribute("href", "/admin/categories");
    expect(screen.getByRole("link", { name: /Ver tienda/ })).toHaveAttribute("href", "/");
    expect(screen.getByText("contenido-admin")).toBeInTheDocument();
  });
});

describe("AdminProducts", () => {
  const cats = [{ category_id: 1, category_name: "Rosas" }, { category_id: 2, category_name: "Tulipanes" }];
  const normal = makeProduct({ product_id: 1, product_name: "Rosas Rojas", stock: 50, critical_stock: 5, price: 15000 });
  const critico = makeProduct({ product_id: 2, product_name: "Tulipán", stock: 2, critical_stock: 5, price: 8000, category_id: 2 });
  let mocks: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(() => {
    mocks = {
      fetchProducts: vi.fn(),
      fetchCategories: vi.fn(),
      createProduct: vi.fn().mockResolvedValue({ success: true, message: "Producto Creado" }),
      updateProduct: vi.fn().mockResolvedValue({ success: true, message: "Producto actualizado" }),
      deleteProduct: vi.fn().mockResolvedValue({ success: true, message: "Producto eliminado" }),
    };
    useProductStore.setState({ products: [normal, critico], categories: cats, loading: false, error: null, ...mocks });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("muestra una fila por producto con precio y stock", () => {
    renderWithRouter(<AdminProducts />);
    expect(screen.getAllByRole("row")).toHaveLength(3); // encabezado + 2
    expect(screen.getByText("Rosas Rojas")).toBeInTheDocument();
    expect(screen.getByText("$15.000")).toBeInTheDocument();
  });

  it("marca como Crítico solo los productos con stock ≤ stock crítico", () => {
    renderWithRouter(<AdminProducts />);
    expect(screen.getByText("OK")).toBeInTheDocument();
    expect(screen.getByText(/Crítico/)).toBeInTheDocument();
  });

  it("muestra carga y error", () => {
    useProductStore.setState({ loading: true });
    const { container, unmount } = renderWithRouter(<AdminProducts />);
    expect(container.querySelector(".loading")).toBeInTheDocument();
    unmount();
    useProductStore.setState({ loading: false, error: "Falló la carga" });
    renderWithRouter(<AdminProducts />);
    expect(screen.getByText("Falló la carga")).toBeInTheDocument();
  });

  it("no pide datos si el store ya los tiene", () => {
    renderWithRouter(<AdminProducts />);
    expect(mocks.fetchProducts).not.toHaveBeenCalled();
    expect(mocks.fetchCategories).not.toHaveBeenCalled();
  });

  it("'+ Nuevo producto' abre el modal en modo creación con la primera categoría", async () => {
    renderWithRouter(<AdminProducts />);
    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument(); // dialog abierto
    expect(screen.getByRole("heading", { name: "Nuevo producto" })).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("1");
  });

  it("crear sin nombre muestra alerta y no llama a createProduct", async () => {
    renderWithRouter(<AdminProducts />);
    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));
    await userEvent.click(screen.getByRole("button", { name: "Crear producto" }));
    expect(window.alert).toHaveBeenCalledWith("El nombre es obligatorio");
    expect(mocks.createProduct).not.toHaveBeenCalled();
  });

  it("crear con nombre llama a createProduct y cierra el modal", async () => {
    renderWithRouter(<AdminProducts />);
    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));
    await userEvent.type(screen.getByPlaceholderText("Nombre del producto"), "Lirios");
    await userEvent.click(screen.getByRole("button", { name: "Crear producto" }));
    await waitFor(() => expect(mocks.createProduct).toHaveBeenCalledTimes(1));
    expect(mocks.createProduct.mock.calls[0][0]).toMatchObject({ product_name: "Lirios", category_id: 1 });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("'Editar' abre el modal con los datos del producto y guarda los cambios", async () => {
    renderWithRouter(<AdminProducts />);
    await userEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]);
    expect(screen.getByRole("heading", { name: "Editar producto" })).toBeInTheDocument();
    const nombre = screen.getByPlaceholderText("Nombre del producto");
    expect(nombre).toHaveValue("Rosas Rojas");
    fireEvent.change(nombre, { target: { name: "product_name", value: "Rosas Premium" } });
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    await waitFor(() => expect(mocks.updateProduct).toHaveBeenCalledTimes(1));
    expect(mocks.updateProduct.mock.calls[0][0]).toBe(1);
    expect(mocks.updateProduct.mock.calls[0][1]).toMatchObject({ product_name: "Rosas Premium", price: 15000 });
  });

  it("si el guardado falla muestra el mensaje del store", async () => {
    mocks.updateProduct.mockResolvedValue({ success: false, message: "No se pudo actualizar" });
    renderWithRouter(<AdminProducts />);
    await userEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]);
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("No se pudo actualizar"));
  });

  it("'Eliminar' pide confirmación y borra solo si se acepta", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    renderWithRouter(<AdminProducts />);
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(mocks.deleteProduct).not.toHaveBeenCalled();
    confirmSpy.mockReturnValue(true);
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(mocks.deleteProduct).toHaveBeenCalledWith(1);
  });
});

describe("AdminUsers", () => {
  const adminRow = { user_id: 1, full_name: "Jefa", email: "jefa@floreria.com", role: "ADMIN", account_status: "ACTIVE" };
  const cliente = { user_id: 2, full_name: "Ana", email: "ana@gmail.com", role: "CUSTOMER", account_status: "ACTIVE" };
  const vendedor = { user_id: 3, full_name: "Beto", email: "beto@gmail.com", role: "SELLER", account_status: "INACTIVE" };
  let mocks: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(() => {
    mocks = {
      fetchUsers: vi.fn(),
      createUser: vi.fn().mockResolvedValue({ success: true, message: "Usuario creado correctamente" }),
      updateUser: vi.fn().mockResolvedValue({ success: true, message: "Usuario actualizado" }),
      deleteUser: vi.fn().mockResolvedValue({ success: true, message: "Usuario eliminado" }),
    };
    useUserStore.setState({ users: [adminRow, cliente, vendedor], loading: false, error: null, ...mocks });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("pide los usuarios al montar", () => {
    renderWithRouter(<AdminUsers />);
    expect(mocks.fetchUsers).toHaveBeenCalledTimes(1);
  });

  it("lista usuarios pero oculta a los ADMIN", () => {
    renderWithRouter(<AdminUsers />);
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Beto")).toBeInTheDocument();
    expect(screen.queryByText("Jefa")).not.toBeInTheDocument();
    expect(screen.getByText("INACTIVE")).toBeInTheDocument();
  });

  it("muestra carga y error", () => {
    useUserStore.setState({ loading: true });
    const { container, unmount } = renderWithRouter(<AdminUsers />);
    expect(container.querySelector(".loading")).toBeInTheDocument();
    unmount();
    useUserStore.setState({ loading: false, error: "No se pudieron cargar los usuarios" });
    renderWithRouter(<AdminUsers />);
    expect(screen.getByText("No se pudieron cargar los usuarios")).toBeInTheDocument();
  });

  it("crear con campos vacíos muestra alerta y no llama a createUser", async () => {
    renderWithRouter(<AdminUsers />);
    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo usuario" }));
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));
    expect(window.alert).toHaveBeenCalledWith("Todos los campos son obligatorios");
    expect(mocks.createUser).not.toHaveBeenCalled();
  });

  it("crear con datos válidos llama a createUser y cierra el modal", async () => {
    renderWithRouter(<AdminUsers />);
    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo usuario" }));
    await userEvent.type(screen.getByPlaceholderText("Nombre completo"), "Caro");
    await userEvent.type(screen.getByPlaceholderText("Email"), "caro@gmail.com");
    await userEvent.type(screen.getByPlaceholderText("Contraseña"), "1234");
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));
    await waitFor(() =>
      expect(mocks.createUser).toHaveBeenCalledWith({ full_name: "Caro", email: "caro@gmail.com", password: "1234", role: "CUSTOMER" }),
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("si createUser falla muestra el mensaje", async () => {
    mocks.createUser.mockResolvedValue({ success: false, message: "El correo ya está registrado" });
    renderWithRouter(<AdminUsers />);
    await userEvent.click(screen.getByRole("button", { name: "+ Nuevo usuario" }));
    await userEvent.type(screen.getByPlaceholderText("Nombre completo"), "Caro");
    await userEvent.type(screen.getByPlaceholderText("Email"), "ana@gmail.com");
    await userEvent.type(screen.getByPlaceholderText("Contraseña"), "1234");
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("El correo ya está registrado"));
  });

  it("editar abre el modal con los datos y guarda nombre, rol y estado", async () => {
    renderWithRouter(<AdminUsers />);
    await userEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]); // Ana
    expect(screen.getByRole("heading", { name: "Editar usuario" })).toBeInTheDocument();
    const nombre = screen.getByDisplayValue("Ana");
    fireEvent.change(nombre, { target: { value: "Ana María" } });
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    await waitFor(() =>
      expect(mocks.updateUser).toHaveBeenCalledWith(2, { full_name: "Ana María", role: "CUSTOMER", account_status: "ACTIVE" }),
    );
  });

  it("eliminar pide confirmación", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    renderWithRouter(<AdminUsers />);
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(mocks.deleteUser).not.toHaveBeenCalled();
    confirmSpy.mockReturnValue(true);
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(mocks.deleteUser).toHaveBeenCalledWith(2);
  });

  it("si deleteUser falla muestra el mensaje", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    mocks.deleteUser.mockResolvedValue({ success: false, message: "No se pudo eliminar" });
    renderWithRouter(<AdminUsers />);
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("No se pudo eliminar"));
  });
});

describe("AdminCategories", () => {
  const cats = [{ category_id: 1, category_name: "Rosas" }, { category_id: 2, category_name: "Tulipanes" }];
  let mocks: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(() => {
    mocks = {
      fetchCategories: vi.fn(),
      updateCategory: vi.fn().mockResolvedValue({ success: true, message: "Categoría actualizada" }),
      deleteCategory: vi.fn().mockResolvedValue({ success: true, message: "Categoría eliminada" }),
    };
    useProductStore.setState({ categories: cats, loading: false, error: null, ...mocks });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  const nombreInput = () => screen.getByPlaceholderText("Ej: Plantas de interior");

  it("pide las categorías al montar y las lista con su cantidad", () => {
    renderWithRouter(<AdminCategories />);
    expect(mocks.fetchCategories).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Rosas")).toBeInTheDocument();
    expect(screen.getByText("Tulipanes")).toBeInTheDocument();
    expect(screen.getByText("(2)")).toBeInTheDocument();
  });

  it("muestra carga", () => {
    useProductStore.setState({ loading: true });
    const { container } = renderWithRouter(<AdminCategories />);
    expect(container.querySelector(".loading")).toBeInTheDocument();
  });

  it("crear sin nombre muestra error y no llama al backend", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderWithRouter(<AdminCategories />);
    await userEvent.click(screen.getByRole("button", { name: "CREAR CATEGORÍA" }));
    expect(screen.getByText("El nombre es obligatorio")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("crear OK: limpia el campo, avisa y refresca la lista", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ status: "OK" }));
    renderWithRouter(<AdminCategories />);
    await userEvent.type(nombreInput(), "Orquídeas");
    await userEvent.click(screen.getByRole("button", { name: "CREAR CATEGORÍA" }));
    expect(await screen.findByText("Categoría creada")).toBeInTheDocument();
    expect(nombreInput()).toHaveValue("");
    expect(JSON.parse(fetchSpy.mock.lastCall![1]!.body as string)).toEqual({ category_name: "Orquídeas" });
    expect(mocks.fetchCategories).toHaveBeenCalledTimes(2);
  });

  it("crear duplicada muestra 'Esa categoría ya existe'", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ status: "ALREADY_EXISTS" }));
    renderWithRouter(<AdminCategories />);
    await userEvent.type(nombreInput(), "Rosas");
    await userEvent.click(screen.getByRole("button", { name: "CREAR CATEGORÍA" }));
    expect(await screen.findByText("Esa categoría ya existe")).toBeInTheDocument();
  });

  it("crear con error de red muestra 'Error de conexión'", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("x"));
    renderWithRouter(<AdminCategories />);
    await userEvent.type(nombreInput(), "Rosas");
    await userEvent.click(screen.getByRole("button", { name: "CREAR CATEGORÍA" }));
    expect(await screen.findByText("Error de conexión")).toBeInTheDocument();
  });

  it("eliminar pide confirmación y llama a deleteCategory", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    renderWithRouter(<AdminCategories />);
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(mocks.deleteCategory).not.toHaveBeenCalled();
    confirmSpy.mockReturnValue(true);
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(mocks.deleteCategory).toHaveBeenCalledWith(1);
  });

  it("si no se puede eliminar muestra el mensaje en una alerta", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    mocks.deleteCategory.mockResolvedValue({ success: false, message: "No se puede eliminar: tiene 2 producto(s) asociado(s)" });
    renderWithRouter(<AdminCategories />);
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("2 producto(s)")));
  });

  it("editar abre el modal con el nombre y guarda el nuevo nombre", async () => {
    renderWithRouter(<AdminCategories />);
    await userEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]);
    expect(screen.getByRole("heading", { name: "Editar categoría" })).toBeInTheDocument();
    const input = screen.getByDisplayValue("Rosas");
    fireEvent.change(input, { target: { value: "Rosas Premium" } });
    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
    await waitFor(() => expect(mocks.updateCategory).toHaveBeenCalledWith(1, "Rosas Premium"));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});