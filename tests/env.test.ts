require("dotenv").config();

describe("Variaveis de Ambiente", () => {
  test("DB_HOST", () => {
    return expect(process.env.DB_HOST).toBeDefined();
  });
  test("DB_USER", () => {
    return expect(process.env.DB_USER).toBeDefined();
  });
  test("DB_PASS", () => {
    return expect(process.env.DB_PASS).toBeDefined();
  });
  test("DB_DATABASE", () => {
    return expect(process.env.DB_DATABASE).toBeDefined();
  });
});
