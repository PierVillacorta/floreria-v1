import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryModal } from "../../components/modals/CategoryModal";

// El <dialog> está cerrado por defecto: usamos { hidden: true } para encontrar sus botones.
const hidden = { hidden: true } as const;

describe("CategoryModal", () => {
  it("muestra el nombre recibido; onChange y onSave se ejecutan", async () => {
    const onChange = vi.fn();
    const onSave = vi.fn();
    render(<CategoryModal editName="Rosas" saving={false} onChange={onChange} onSave={onSave} />);

    fireEvent.change(screen.getByDisplayValue("Rosas"), { target: { value: "Rosas Premium" } });
    expect(onChange).toHaveBeenCalledWith("Rosas Premium");

    await userEvent.click(screen.getByRole("button", { name: "Guardar", ...hidden }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("con saving=true muestra 'Guardando...' y deshabilita el botón", () => {
    render(<CategoryModal editName="Rosas" saving={true} onChange={() => {}} onSave={() => {}} />);
    expect(screen.getByRole("button", { name: "Guardando...", ...hidden })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Guardar", ...hidden })).not.toBeInTheDocument();
  });
});