import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "../../pages/Login";
import { useAuthStore } from "../../store/authStore";
import { renderWithRouter } from "../helpers";

// Login usa GoogleLogin, que exige GoogleOAuthProvider: lo reemplazamos por un componente vacío.
vi.mock("@react-oauth/google", () => ({ GoogleLogin: () => null }));

describe("Login", () => {
  let loginMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    loginMock = vi.fn().mockResolvedValue({ success: false, message: "Datos incorrectos" });
    useAuthStore.setState({ login: loginMock });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  const campos = () => ({
    email: screen.getByLabelText("Email"),
    password: screen.getByLabelText("Contraseña"),
    enviar: screen.getByRole("button", { name: "INICIAR SESIÓN" }),
  });

  it("renderiza título, campos, botón y enlace a registro", () => {
    renderWithRouter(<Login />, "/login");
    const { email, password, enviar } = campos();
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(enviar).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Registrate" })).toHaveAttribute("href", "/register");
  });

  it("actualiza el estado de los inputs al escribir", async () => {
    renderWithRouter(<Login />, "/login");
    const { email, password } = campos();
    await userEvent.type(email, "ana@gmail.com");
    await userEvent.type(password, "1234");
    expect(email).toHaveValue("ana@gmail.com");
    expect(password).toHaveValue("1234");
  });

  it("el error no se ve al inicio y sí con campos vacíos (sin llamar a login)", async () => {
    renderWithRouter(<Login />, "/login");
    expect(screen.queryByText("Todos los campos son obligatorios")).not.toBeInTheDocument();

    await userEvent.click(campos().enviar);

    expect(await screen.findByText("Todos los campos son obligatorios")).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("con datos válidos llama a login(email, password)", async () => {
    renderWithRouter(<Login />, "/login");
    const { email, password, enviar } = campos();
    await userEvent.type(email, "ana@gmail.com");
    await userEvent.type(password, "clave123");
    await userEvent.click(enviar);
    expect(loginMock).toHaveBeenCalledWith("ana@gmail.com", "clave123");
  });
});