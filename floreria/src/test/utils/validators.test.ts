import { isValidEmail, isValidPassword } from "../../utils/Validators";

describe("Validators", () => {
  it("acepta correos de dominios permitidos", () => {
    ["alumno@duoc.cl", "doc@profesor.duoc.cl", "user@gmail.com", "ADMIN@Floreria.com"].forEach((e) =>
      expect(isValidEmail(e)).toBe(true),
    );
  });

  it("rechaza dominios no permitidos o vacío", () => {
    ["user@hotmail.com", "user@yahoo.es", ""].forEach((e) => expect(isValidEmail(e)).toBe(false));
  });

  it("la contraseña debe tener entre 4 y 10 caracteres", () => {
    expect(isValidPassword("abc")).toBe(false);
    expect(isValidPassword("abcd")).toBe(true);
    expect(isValidPassword("1234567890")).toBe(true);
    expect(isValidPassword("12345678901")).toBe(false);
  });
});