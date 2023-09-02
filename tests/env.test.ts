require('dotenv').config();

describe("Variaveis de Ambiente", () => {
  test("NODE_ENV", () => {
    return expect(process.env.NODE_ENV).toBeDefined();
  });
  test("DB_HOST", () => {
    return expect(process.env.DB_HOST_DEV).toBeDefined();
  });
  test("DB_USER", () => {
    return expect(process.env.DB_USER_DEV).toBeDefined();
  });
  test("DB_PASS", () => {
    return expect(process.env.DB_PASS_DEV).toBeDefined();
  });
  test("DB_DATABASE", () => {
    return expect(process.env.DB_DATA_DEV).toBeDefined();
  });
});
