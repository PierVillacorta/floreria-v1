import { useAuthStore } from "../../store/authStore";
import { emptyResponse, jsonResponse, makeUser } from "../helpers";

describe("authStore", () => {
  const user = makeUser({ user_id: 7, role: "ADMIN" });

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null, loading: false, authError: null });
  });
  afterEach(() => vi.restoreAllMocks());

  it("login guarda usuario y token", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ token: "tok123", token_type: "Bearer", expires_in: 3600, user }),
    );
    const res = await useAuthStore.getState().login("ana@gmail.com", "1234");
    expect(res).toEqual({ success: true, message: "Bienvenido!" });
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().token).toBe("tok123");
  });

  it("login guarda authError si el backend devuelve 401", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ detail: "Credenciales inválidas" }, 401),
    );
    const res = await useAuthStore.getState().login("ana@gmail.com", "mala");
    expect(res).toEqual({ success: false, message: "Credenciales inválidas" });
    expect(useAuthStore.getState().authError).toBe("Credenciales inválidas");
  });

  it("loginWithGoogle autentica con credential", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ token: "gtok", token_type: "Bearer", expires_in: 3600, user }),
    );
    const res = await useAuthStore.getState().loginWithGoogle("google-jwt");
    expect(res.success).toBe(true);
    expect(useAuthStore.getState().token).toBe("gtok");
  });

  it("register envía RegisterData completo", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(emptyResponse(201));
    const payload = {
      full_name: "Ana",
      email: "ana@gmail.com",
      password: "1234",
      address: "Calle 1",
      region: "RM",
      commune: "Santiago",
    };
    const res = await useAuthStore.getState().register(payload);
    expect(res).toEqual({ success: true, message: "Cuenta creada correctamente!!" });
    expect(JSON.parse(spy.mock.lastCall![1]!.body as string)).toEqual(payload);
  });

  it("logout limpia sesión", () => {
    useAuthStore.setState({ user, token: "abc" });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });
});