import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import apiV1 from "./routes/api/apiV1";

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use(cors());
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/api/v1", apiV1);

export default app;
