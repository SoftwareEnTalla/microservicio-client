import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Pool, PoolConfig } from "pg";
import path from "path";
import "reflect-metadata";
import { CustomPostgresOptions } from "./interfaces/typeorm.interface";

dotenv.config();

const REQUIRED_EXTENSIONS = ["pg_trgm", "uuid-ossp", "pg_stat_statements"];

export const AppDataSource = new DataSource({
  type: "postgres",
  name: "client-service",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "entalla",
  password: process.env.DB_PASS || "entalla",
  database: process.env.DB_NAME || "entalla",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  entities: [path.join(__dirname, "**/*.entity.{js,ts}")],
  migrations: [path.join(__dirname, "migrations/**/*.{ts,js}")],
  migrationsTableName: "migrations_history",
  extra: {
    max: 20,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    application_name: "nestjs-application",
  },
} as CustomPostgresOptions);

async function checkPostgreSQLExtensions() {
  const poolConfig: PoolConfig = {
    user: process.env.DB_USER || "entalla",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "entalla",
    password: process.env.DB_PASS || "entalla",
    port: Number(process.env.DB_PORT) || 5432,
  };

  const pool = new Pool(poolConfig);
  const client = await pool.connect();

  try {
    for (const ext of REQUIRED_EXTENSIONS) {
      const res = await client.query(
        `SELECT * FROM pg_available_extensions WHERE name = $1`,
        [ext]
      );
      if (res.rows.length === 0) {
        console.warn(`⚠️ Extensión '${ext}' no disponible`);
      } else {
        console.log(`✅ Extensión '${ext}' instalada`);
        await client.query(`CREATE EXTENSION IF NOT EXISTS "${ext}"`);
      }
    }
  } finally {
    await client.release();
    await pool.end();
  }
}

export async function initializeDatabase() {
  try {
    if (!AppDataSource.isInitialized) {
      await checkPostgreSQLExtensions();
      await AppDataSource.initialize();
      console.log("📦 DataSource inicializado correctamente");
    }
    return AppDataSource;
  } catch (error) {
    console.error("❌ Error durante la inicialización:", error);
    throw error;
  }
}
