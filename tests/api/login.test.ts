import request from "supertest";
import app from "../../src/app";

const credencias = { login: "dariel.campos18@icloud.com", senha: "leirad123" };
let token = undefined;

describe("Usuario", () => {
  test("Realizando login", async () => {
    const res = await request(app).post("/api/v1/login").send(credencias);
    expect(res.status).toEqual(200);
    token = res.body;
  });

  test("Realizando logout", async () => {
    const res = await request(app).get("/api/v1/logout").set({ token });
    expect(res.status).toEqual(200);
  });
});
