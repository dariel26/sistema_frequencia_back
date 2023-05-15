import app from "./app";

const port = 5000;

app.get("/", (_, res) => {
  res.json("API ESTÁ RODANDO");
});

app.listen(port, () => {
  console.log("Rodando no endereço: http://localhost:5000");
});

export default app;
