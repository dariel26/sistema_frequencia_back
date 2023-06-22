import app from "./app";

const port = 5000;
const host = '150.162.235.122';
app.get("/", (_, res) => {
  res.json("API ESTÁ RODANDO");
});

app.listen(port, host, () => {
  console.log("Rodando no endereço: http://192.168.0.103:5000");
});

export default app;
