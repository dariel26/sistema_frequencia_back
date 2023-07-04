import app from "./app";

const port = parseInt(process.env.PORT ?? "5000");
const host = process.env.HOSTNAME;
app.get("/", (_, res) => {
  res.json("API ESTÁ RODANDO");
});

app.listen(port, host ?? "localhost", () => {
  console.log(`Rodando no endereço: http://${host}:${port}`);
});

export default app;
