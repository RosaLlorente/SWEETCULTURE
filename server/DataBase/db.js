import mysql from 'mysql2';
import {DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,DB_PORT} from "../confing.js";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

export default db;
