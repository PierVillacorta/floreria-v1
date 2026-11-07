import { useUserStore } from "../store/usersStore";
import { jsonResponse } from "./helpers";

const fetchSeq = (...bodies: unknown[]) => {
  const spy = vi.spyOn(globalThis, "fetch");
  bodies.forEach((b) => spy.mockResolvedValueOnce(jsonResponse(b)));
  return spy;
};

describe("usersStore (fetch mockeado)", () => {
  const u1 = { user_id: 1, full_name: "Ana", email: "ana@gmail.com", role: "CUSTOMER", account_status: "ACTIVE" };
  const u2 = { user_id: 2, full_name: "Beto", email: "beto@gmail.com", role: "SELLER", account_status: "ACTIVE" };
  const nuevo = { full_name: "Caro", email: "caro@gmail.com", password: "1234", role: "CUSTOMER" };

  beforeEach(() => useUserStore.setState({ users: [], loading: false, error: null }));
  afterEach(() => vi.restoreAllMocks());

  it("fetchUsers guarda la lista", async () => {
    fetchSeq({ items: [u1, u2] });
    await useUserStore.getState().fetchUsers();
    expect(useUserStore.getState().users).toHaveLength(2);
    expect(useUserStore.getState().loading).toBe(false);
  });

  it("fetchUsers guarda error si falla la red", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("x"));
    await useUserStore.getState().fetchUsers();
    expect(useUserStore.getState().error).toBe("No se pudieron cargar los usuarios");
  });

  it("createUser OK refresca la lista", async () => {
    const spy = fetchSeq({ status: "OK" }, { items: [u1] });
    const res = await useUserStore.getState().createUser(nuevo);
    expect(res).toEqual({ success: true, message: "Usuario creado correctamente" });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("createUser informa si el correo ya existe", async () => {
    fetchSeq({ status: "EMAIL_EXISTS" });
    const res = await useUserStore.getState().createUser(nuevo);
    expect(res).toEqual({ success: false, message: "El correo ya está registrado" });
  });

  it("createUser informa error genérico y error de conexión", async () => {
    fetchSeq({ status: "ERROR" });
    expect((await useUserStore.getState().createUser(nuevo)).message).toBe("No se pudo crear el usuario");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("x"));
    expect((await useUserStore.getState().createUser(nuevo)).message).toBe("Error de conexion");
  });

  it("deleteUser quita al usuario de la lista", async () => {
    useUserStore.setState({ users: [u1, u2] });
    fetchSeq({ status: "OK" });
    const res = await useUserStore.getState().deleteUser(1);
    expect(res.success).toBe(true);
    expect(useUserStore.getState().users.map((u) => u.user_id)).toEqual([2]);
  });

  it("deleteUser deja la lista igual si falla", async () => {
    useUserStore.setState({ users: [u1] });
    fetchSeq({ status: "ERROR" });
    const res = await useUserStore.getState().deleteUser(1);
    expect(res).toEqual({ success: false, message: "No se pudo eliminar" });
    expect(useUserStore.getState().users).toHaveLength(1);
  });

  it("updateUser actualiza solo al usuario indicado", async () => {
    useUserStore.setState({ users: [u1, u2] });
    fetchSeq({ status: "OK" });
    const res = await useUserStore.getState().updateUser(1, { full_name: "Ana María" });
    expect(res.success).toBe(true);
    expect(useUserStore.getState().users[0].full_name).toBe("Ana María");
    expect(useUserStore.getState().users[1].full_name).toBe("Beto");
  });

  it("updateUser informa error si falla", async () => {
    fetchSeq({ status: "ERROR" });
    const res = await useUserStore.getState().updateUser(1, { role: "SELLER" });
    expect(res).toEqual({ success: false, message: "No se pudo actualizar" });
  });
});