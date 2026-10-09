import { isValidEmail, isValidPassword } from "../utils/Validators";

describe("Validators.isValidEmail", () => {
  it.each(["alumno@duoc.cl", "docente@profesor.duoc.cl", "user@gmail.com", "admin@floreria.com"])(
    "acepta el dominio permitido: %s",
    (email) => expect(isValidEmail(email)).toBe(true),
  );

  it.each(["user@hotmail.com", "user@yahoo.es", "user@notgmail.com", ""])("rechaza: '%s'", (email) =>
    expect(isValidEmail(email)).toBe(false),
  );

  it("no distingue mayúsculas y elimina espacios", () => {
    expect(isValidEmail("  USER@GMAIL.COM  ")).toBe(true);
  });
});

describe("Validators.isValidPassword", () => {
  it.each([
    ["abcd", true],
    ["abcdefghij", true],
    ["abc", false],
    ["", false],
    ["abcdefghijk", false],
  ])("'%s' -> %s", (password, esperado) => expect(isValidPassword(password)).toBe(esperado));
});