import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: "alex",
  password: "",
  host: "localhost",
  password: 5432,
  database: "alex",
});

export default pool;
