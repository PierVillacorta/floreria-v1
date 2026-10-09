import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryModal } from "../components/modals/CategoryModal";
import { CreateUserModal } from "../components/modals/CreateUserModal";
import { ProductModal } from "../components/modals/ProductModal";
import { UserModal } from "../components/modals/UserModal";
import type { ProductForm } from "../types/types";

// Los <dialog> están cerrados por defecto: usamos { hidden: true } para encontrar sus botones.
const hidden = { hidden: true } as const;

describe("CategoryModal", () => {
  const base = { editName: "Rosas", saving: false, onChange: vi.fn(), onSave: vi.fn() };
  beforeEach(() => vi.clearAllMocks());

  it("muestra el título y el nombre actual", () => {
    render(<CategoryModal {...base} />);
    expect(screen.getByText("Editar categoría")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Rosas")).toBeInTheDocument();
  });

  it("llama a onChange al escribir y a onSave al guardar", async () => {
    render(<CategoryModal {...base} />);
    fireEvent.change(screen.getByDisplayValue("Rosas"), { target: { value: "Rosas 2" } });
    expect(base.onChange).toHaveBeenCalledWith("Rosas 2");
    await userEvent.click(screen.getByRole("button", { name: "Guardar", ...hidden }));
    expect(base.onSave).toHaveBeenCalledTimes(1);
  });

  it("con saving=true deshabilita el botón y cambia el texto", () => {
    render(<CategoryModal {...base} saving />);
    expect(screen.getByRole("button", { name: "Guardando...", ...hidden })).toBeDisabled();
  });
});

describe("CreateUserModal", () => {
  const newUser = { full_name: "", email: "", password: "", role: "CUSTOMER" };
  const base = { newUser, creating: false, onChange: vi.fn(), onClose: vi.fn(), onCreate: vi.fn() };
  beforeEach(() => vi.clearAllMocks());

  it("muestra los campos y los roles CUSTOMER y SELLER", () => {
    render(<CreateUserModal {...base} />);
    expect(screen.getByPlaceholderText("Nombre completo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
    expect(screen.getAllByRole("option", hidden).map((o) => o.textContent)).toEqual(["CUSTOMER", "SELLER"]);
  });

  it("notifica el campo y el valor que cambia", () => {
    render(<CreateUserModal {...base} />);
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@gmail.com" } });
    expect(base.onChange).toHaveBeenCalledWith("email", "a@gmail.com");
    fireEvent.change(screen.getByRole("combobox", hidden), { target: { value: "SELLER" } });
    expect(base.onChange).toHaveBeenCalledWith("role", "SELLER");
  });

  it("Crear llama a onCreate y Cancelar a onClose", async () => {
    render(<CreateUserModal {...base} />);
    await userEvent.click(screen.getByRole("button", { name: "Crear", ...hidden }));
    await userEvent.click(screen.getByRole("button", { name: "Cancelar", ...hidden }));
    expect(base.onCreate).toHaveBeenCalledTimes(1);
    expect(base.onClose).toHaveBeenCalledTimes(1);
  });

  it("con creating=true deshabilita los botones", () => {
    render(<CreateUserModal {...base} creating />);
    expect(screen.getByRole("button", { name: "Creando...", ...hidden })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar", ...hidden })).toBeDisabled();
  });
});

describe("ProductModal", () => {
  const form: ProductForm = {
    product_name: "Rosas", price: 15000, stock: 10, description: "Ramo", critical_stock: 3, image_url: "x.jpg", category_id: 2,
  };
  const categories = [{ category_id: 1, category_name: "Tulipanes" }, { category_id: 2, category_name: "Rosas" }];
  const base = { mode: "edit" as const, form, categories, saving: false, onChange: vi.fn(), onSave: vi.fn() };
  beforeEach(() => vi.clearAllMocks());

  it("modo edit: título y botón 'Guardar cambios'", () => {
    render(<ProductModal {...base} />);
    expect(screen.getByText("Editar producto")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar cambios", ...hidden })).toBeInTheDocument();
  });

  it("modo create: título y botón 'Crear producto'", () => {
    render(<ProductModal {...base} mode="create" />);
    expect(screen.getByText("Nuevo producto")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Crear producto", ...hidden })).toBeInTheDocument();
  });

  it("muestra los valores del formulario y las categorías como opciones", () => {
    render(<ProductModal {...base} />);
    expect(screen.getByPlaceholderText("Nombre del producto")).toHaveValue("Rosas");
    expect(screen.getByDisplayValue("15000")).toBeInTheDocument();
    expect(screen.getByRole("combobox", hidden)).toHaveValue("2");
    expect(screen.getAllByRole("option", hidden)).toHaveLength(2);
  });

  it("onChange se dispara al editar un campo y onSave al guardar", async () => {
    render(<ProductModal {...base} />);
    fireEvent.change(screen.getByPlaceholderText("Nombre del producto"), { target: { value: "Nuevo" } });
    expect(base.onChange).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios", ...hidden }));
    expect(base.onSave).toHaveBeenCalledTimes(1);
  });

  it("con saving=true deshabilita el botón", () => {
    render(<ProductModal {...base} saving />);
    expect(screen.getByRole("button", { name: "Guardando...", ...hidden })).toBeDisabled();
  });
});

describe("UserModal", () => {
  const selected = { user_id: 1, full_name: "Ana", email: "a@gmail.com", role: "SELLER", account_status: "ACTIVE" };
  const base = { selected, saving: false, onChange: vi.fn(), onSave: vi.fn() };
  beforeEach(() => vi.clearAllMocks());

  it("sin usuario seleccionado no muestra el formulario", () => {
    render(<UserModal {...base} selected={null} />);
    expect(screen.getByText("Editar usuario")).toBeInTheDocument();
    expect(screen.queryByText("Rol")).not.toBeInTheDocument();
  });

  it("muestra nombre, rol y estado del usuario", () => {
    render(<UserModal {...base} />);
    expect(screen.getByDisplayValue("Ana")).toBeInTheDocument();
    const [rol, estado] = screen.getAllByRole("combobox", hidden);
    expect(rol).toHaveValue("SELLER");
    expect(estado).toHaveValue("ACTIVE");
  });

  it("notifica cambios de nombre, rol y estado", () => {
    render(<UserModal {...base} />);
    fireEvent.change(screen.getByDisplayValue("Ana"), { target: { value: "Ana!" } });
    expect(base.onChange).toHaveBeenCalledWith("full_name", "Ana!");
    const [rol, estado] = screen.getAllByRole("combobox", hidden);
    fireEvent.change(rol, { target: { value: "CUSTOMER" } });
    fireEvent.change(estado, { target: { value: "INACTIVE" } });
    expect(base.onChange).toHaveBeenCalledWith("role", "CUSTOMER");
    expect(base.onChange).toHaveBeenCalledWith("account_status", "INACTIVE");
  });

  it("Guardar llama a onSave", async () => {
    render(<UserModal {...base} />);
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios", ...hidden }));
    expect(base.onSave).toHaveBeenCalledTimes(1);
  });
});