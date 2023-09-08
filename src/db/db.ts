import mysql from "mysql2";

const ambiente = process.env.NODE_ENV;

console.log(ambiente);

const host =
  ambiente === "dev" ? process.env.DB_HOST_DEV : process.env.DB_HOST_PRO;

const user =
  ambiente === "dev" ? process.env.DB_USER_DEV : process.env.DB_USER_PRO;

const pass =
  ambiente === "dev" ? process.env.DB_PASS_DEV : process.env.DB_PASS_PRO;

const data =
  ambiente === "dev" ? process.env.DB_DATA_DEV : process.env.DB_DATA_PRO;

const port =
  ambiente === "dev" ? process.env.DB_PORT_DEV : process.env.DB_PORT_PRO;

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

if (ambiente === "dev")
  console.log(
    `Conectado ao banco de dados com sucesso,
   dados: DB_HOST: ${host} DB_DATA: ${data} DB_PORT: ${port}`
  );

export default db;
