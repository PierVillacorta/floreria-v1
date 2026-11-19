import { useUserStore } from "../../store/usersStore";
import { emptyResponse, jsonResponse } from "../helpers";

describe("usersStore", () => {
  const u1 = { user_id: 1, full_name: "Ana", email: "ana@gmail.com", role: "CUSTOMER", account_status: "ACTIVE" };
  const u2 = { user_id: 2, full_name: "Beto", email: "beto@gmail.com", role: "SELLER", account_status: "ACTIVE" };

  beforeEach(() => useUserStore.setState({ users: [], loading: false, error: null }));
  afterEach(() => vi.restoreAllMocks());

  it("fetchUsers guarda la lista de usuarios", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([u1, u2]));
    await useUserStore.getState().fetchUsers();
    expect(useUserStore.getState().users).toHaveLength(2);
  });

  it("createUser agrega el usuario creado", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(u1, 201));
    const res = await useUserStore.getState().createUser({
      full_name: "Ana",
      email: "ana@gmail.com",
      password: "1234",
      role: "CUSTOMER",
      address: "Calle 1",
      region: "RM",
      commune: "Santiago",
    });
    expect(res).toEqual({ success: true, message: "Usuario creado correctamente" });
    expect(useUserStore.getState().users).toEqual([u1]);
  });

  it("updateUser y deleteUser actualizan el estado local", async () => {
    useUserStore.setState({ users: [u1, u2] });
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      jsonResponse({ ...u1, full_name: "Ana María" }),
    );
    await useUserStore.getState().updateUser(1, {
      full_name: "Ana María",
      role: "CUSTOMER",
      account_status: "ACTIVE",
    });
    expect(useUserStore.getState().users[0].full_name).toBe("Ana María");

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(emptyResponse(204));
    await useUserStore.getState().deleteUser(1);
    expect(useUserStore.getState().users.map((u) => u.user_id)).toEqual([2]);
  });
});