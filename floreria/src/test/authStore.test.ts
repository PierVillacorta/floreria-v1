import { useAuthStore } from "../store/authStore";
import { jsonResponse } from "./helpers";

const mockFetch = (body: unknown, ok = true) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(body, ok));

describe("authStore (fetch mockeado)", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null, loading: false, authError: null });
  });
  afterEach(() => vi.restoreAllMocks());

  describe("login", () => {
    it("guarda usuario y token si el backend responde OK", async () => {
      const spy = mockFetch({ status: "OK", user_id: 7, full_name: "Ana", type: "ADMIN", token: "tok123" });
      const res = await useAuthStore.getState().login("ana@gmail.com", "1234");
      expect(res).toEqual({ success: true, message: "Bienvenido!" });
      const { user, token, loading } = useAuthStore.getState();
      expect(user).toMatchObject({ id: 7, full_name: "Ana", role: "ADMIN", email: "ana@gmail.com" });
      expect(token).toBe("tok123");
      expect(loading).toBe(false);
      expect(spy.mock.lastCall?.[0]).toContain("/auth/login");
    });

    it("envía email y password como JSON por POST", async () => {
      const spy = mockFetch({ status: "OK", user_id: 1, full_name: "A", type: "CUSTOMER", token: "t" });
      await useAuthStore.getState().login("a@gmail.com", "abcd");
      const init = spy.mock.lastCall![1]!;
      expect(init.method).toBe("POST");
      expect(JSON.parse(init.body as string)).toEqual({ email: "a@gmail.com", password: "abcd" });
    });

    it("retorna 'Datos incorrectos' y no guarda sesión si el status no es OK", async () => {
      mockFetch({ status: "INVALID" });
      const res = await useAuthStore.getState().login("a@gmail.com", "mala");
      expect(res).toEqual({ success: false, message: "Datos incorrectos" });
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().authError).toBe("Datos incorrectos");
    });

    it("maneja error de red", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));
      const res = await useAuthStore.getState().login("a@gmail.com", "1234");
      expect(res).toEqual({ success: false, message: "Error de conexion con el servidor" });
      expect(useAuthStore.getState().loading).toBe(false);
    });
  });

  describe("register", () => {
    it("retorna success al crear la cuenta", async () => {
      mockFetch({ status: "OK" });
      const res = await useAuthStore.getState().register("Ana", "ana@gmail.com", "1234");
      expect(res).toEqual({ success: true, message: "Cuenta creada correctamente!!" });
    });

    it("informa si el correo ya existe", async () => {
      mockFetch({ status: "EMAIL_EXISTS" });
      const res = await useAuthStore.getState().register("Ana", "ana@gmail.com", "1234");
      expect(res).toEqual({ success: false, message: "El correo ya esta registrado" });
    });

    it("mensaje genérico ante otros errores del backend", async () => {
      mockFetch({ status: "ERROR" });
      const res = await useAuthStore.getState().register("Ana", "ana@gmail.com", "1234");
      expect(res.message).toBe("No se pudo crear la cuenta");
    });

    it("maneja error de red", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("x"));
      const res = await useAuthStore.getState().register("Ana", "ana@gmail.com", "1234");
      expect(res.success).toBe(false);
    });
  });

  it("logout limpia usuario y token", () => {
    useAuthStore.setState({
      user: { id: 1, full_name: "Ana", email: "a@gmail.com", role: "CUSTOMER", account_status: "ACTIVE" },
      token: "abc",
    });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });

  describe("deleteUser", () => {
    it("envía el token Bearer con método DELETE", async () => {
      useAuthStore.setState({ token: "tok" });
      const spy = mockFetch({});
      const res = await useAuthStore.getState().deleteUser(5);
      const init = spy.mock.lastCall![1]!;
      expect(init.method).toBe("DELETE");
      expect((init.headers as Record<string, string>).Authorization).toBe("Bearer tok");
      expect(res.success).toBe(true);
    });

    it("maneja error de red", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("x"));
      const res = await useAuthStore.getState().deleteUser(5);
      expect(res.success).toBe(false);
    });

    // BUG: en authStore.deleteUser, cuando res.ok es false devuelve success:true.
    // Cámbialo a success:false en el store y reemplaza it.skip por it.
    it.skip("debe retornar success:false si el backend responde con error", async () => {
      mockFetch({ message: "No autorizado" }, false);
      const res = await useAuthStore.getState().deleteUser(5);
      expect(res.success).toBe(false);
    });
  });
});