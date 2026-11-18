const { Pool } = require("pg");

let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL (atau POSTGRES_URL) belum diatur.");
    }
    const lokal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
    pool = new Pool({
      connectionString,
      ssl: lokal ? false : { rejectUnauthorized: false },
      max: 3
    });
  }
  return pool;
}

module.exports = { getPool };
