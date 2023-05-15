require("dotenv").config();
import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 200,
  idleTimeout: 60000,
  queueLimit: 0,
});

const db = pool.promise();

export default db;
