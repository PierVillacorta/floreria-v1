import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryModal } from "../../components/modals/CategoryModal";
import { CreateUserModal } from "../../components/modals/CreateUserModal";
import { ProductModal } from "../../components/modals/ProductModal";
import { UserModal } from "../../components/modals/UserModal";
import { OrderDetailModal } from "../../components/modals/OrderDetailModal";
import { useOrderStore } from "../../store/orderStore";
import { makeOrder } from "../helpers";
import type { ProductForm } from "../../types/types";

const hidden = { hidden: true } as const;

describe("CategoryModal", () => {
  const base = { editName: "Rosas", saving: false, onChange: vi.fn(), onSave: vi.fn() };

  it("edita el nombre y dispara onSave", async () => {
    render(<CategoryModal {...base} />);
    fireEvent.change(screen.getByDisplayValue("Rosas"), { target: { value: "Rosas 2" } });
    expect(base.onChange).toHaveBeenCalledWith("Rosas 2");
    await userEvent.click(screen.getByRole("button", { name: "Guardar", ...hidden }));
    expect(base.onSave).toHaveBeenCalledTimes(1);
  });
});

describe("CreateUserModal", () => {
  const newUser = {
    full_name: "",
    email: "",
    password: "",
    role: "CUSTOMER" as const,
    address: "",
    region: "",
    commune: "",
  };
  const base = { newUser, creating: false, onChange: vi.fn(), onClose: vi.fn(), onCreate: vi.fn() };

  it("renderiza campos y notifica cambios", async () => {
    render(<CreateUserModal {...base} />);
    fireEvent.change(screen.getByPlaceholderText("vendedor@floreria.com"), {
      target: { value: "a@gmail.com" },
    });
    expect(base.onChange).toHaveBeenCalledWith("email", "a@gmail.com");
    await userEvent.click(screen.getByRole("button", { name: /cancelar/i, ...hidden }));
    expect(base.onClose).toHaveBeenCalledTimes(1);
  });
});

describe("ProductModal", () => {
  const form: ProductForm = {
    product_code: "FL-01",
    product_name: "Ramo de Rosas",
    price: 15000,
    stock: 10,
    description: "Ramo",
    critical_stock: 3,
    image_url: "x.jpg",
    category_id: 2,
  };
  const categories = [
    { category_id: 1, category_name: "Tulipanes" },
    { category_id: 2, category_name: "Rosas" },
  ];
  const base = {
    mode: "edit" as const,
    form,
    categories,
    saving: false,
    onChange: vi.fn(),
    onSave: vi.fn(),
  };

  it("muestra código, nombre, precio y categorías", async () => {
    render(<ProductModal {...base} />);
    expect(screen.getByDisplayValue("FL-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Ramo de Rosas")).toBeInTheDocument();
    expect(screen.getByRole("combobox", hidden)).toHaveValue("2");
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios", ...hidden }));
    expect(base.onSave).toHaveBeenCalledTimes(1);
  });
});

describe("UserModal", () => {
  const selected = {
    user_id: 1,
    full_name: "Ana",
    email: "a@gmail.com",
    role: "SELLER",
    account_status: "ACTIVE",
  };

  it("notifica cambios y guarda", async () => {
    const onChange = vi.fn();
    const onSave = vi.fn();
    render(<UserModal selected={selected} saving={false} onChange={onChange} onSave={onSave} />);
    fireEvent.change(screen.getByDisplayValue("Ana"), { target: { value: "Ana!" } });
    expect(onChange).toHaveBeenCalledWith("full_name", "Ana!");
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios", ...hidden }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});

describe("OrderDetailModal", () => {
  it("carga y muestra el detalle de la orden", async () => {
    const fetchOrder = vi.fn().mockResolvedValue({ success: true, data: makeOrder({ order_id: 42 }) });
    useOrderStore.setState({ fetchOrder });
    render(<OrderDetailModal orderId={42} onClose={vi.fn()} />);
    expect(await screen.findByText("Rosas Rojas")).toBeInTheDocument();
    expect(screen.getByText("Dejar en conserjería")).toBeInTheDocument();
  });
});