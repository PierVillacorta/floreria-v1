import { ApiError, apiFetch, configureApi, errorMessage } from "../../utils/api";
import { emptyResponse, jsonResponse } from "../helpers";

describe("apiFetch", () => {
  const onUnauthorized = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    configureApi({ getToken: () => "jwt-token", onUnauthorized });
  });
  afterEach(() => vi.restoreAllMocks());

  it("no envía Authorization en rutas públicas aunque exista token", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([]));
    await apiFetch("/products");
    const headers = spy.mock.lastCall![1]!.headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
  });

  it("envía Bearer token cuando auth=true", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([]));
    await apiFetch("/orders", { auth: true });
    const headers = spy.mock.lastCall![1]!.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer jwt-token");
  });

  it("retorna undefined en respuestas 204 No Content", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(emptyResponse(204));
    const res = await apiFetch("/products/1", { method: "DELETE", auth: true });
    expect(res).toBeUndefined();
  });

  it("ejecuta onUnauthorized ante 401 con token y lanza ApiError", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(null, 401));
    await expect(apiFetch("/orders", { auth: true })).rejects.toThrow(
      "Tu sesión expiró. Inicia sesión nuevamente",
    );
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it("combina errores de validación de ProblemDetail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ errors: { email: "Correo inválido", password: "Muy corta" } }, 400),
    );
    await expect(apiFetch("/auth/register", { method: "POST", body: {} })).rejects.toThrow(
      "Correo inválido. Muy corta",
    );
  });

  it("errorMessage devuelve mensaje genérico para errores desconocidos", () => {
    expect(errorMessage(new ApiError("Fallo controlado", 409))).toBe("Fallo controlado");
    expect(errorMessage(new Error("boom"))).toBe("Ocurrió un error inesperado");
  });
});