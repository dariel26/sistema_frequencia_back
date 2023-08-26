import mysql from "mysql2";

const ambiente = process.env.NODE_ENV;

const host =
  ambiente === "pro"
    ? process.env.DB_HOST_PRO
    : ambiente === "hom"
    ? process.env.DB_HOST_HOM
    : process.env.DB_HOST_DEV;
const user =
  ambiente === "pro"
    ? process.env.DB_USER_PRO
    : ambiente === "hom"
    ? process.env.DB_USER_HOM
    : process.env.DB_USER_DEV;
const pass =
  ambiente === "pro"
    ? process.env.DB_PASS_PRO
    : ambiente === "hom"
    ? process.env.DB_PASS_HOM
    : process.env.DB_PASS_DEV;
const data =
  ambiente === "pro"
    ? process.env.DB_DATA_PRO
    : ambiente === "hom"
    ? process.env.DB_DATA_HOM
    : process.env.DB_DATA_DEV;
const port =
  ambiente === "pro"
    ? process.env.DB_PORT_PRO
    : ambiente === "hom"
    ? process.env.DB_PORT_HOM
    : process.env.DB_PORT_DEV;

const pool = mysql.createPool({
  host,
  user,
  password: pass,
  database: data,
  port: parseInt(port ?? "3306"),
  waitForConnections: true,
  connectionLimit: 200,
  idleTimeout: 7000,
  queueLimit: 0,
});

const db = pool.promise();

if (ambiente === "dev") {
  console.log(
    `Conectado ao banco de dados com sucesso, dados: DB_HOST: ${host} DB_USER: ${user} DB_PASS: ${pass} DB_DATA: ${data} DB_PORT: ${port}`
  );
}

export default db;
