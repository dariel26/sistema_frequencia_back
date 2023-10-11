import express from "express";
import cron from "node-cron";
import cors from "cors";
import bodyParser from "body-parser";
import apiV1 from "./routes/api/apiV1";
import {
  carregaPlanejamento,
  notificaAlunos,
} from "./servicos/push_notificacoes/presenca";

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use(cors());
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/api/v1", apiV1);

const aCada15Minutos = "*/15 * * * *";
const aCada12Horas = "0 */12 * * *";
const aCadaMinuto = "* * * * *";

cron.schedule(aCadaMinuto, carregaPlanejamento);
cron.schedule(aCadaMinuto, notificaAlunos);

export default app;
