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


// Añade esta función después de initializeDatabase()
export async function createDatabaseIfNotExists(
  dbName: string,
  owner: string = "postgres"
) {
  const adminPoolConfig: PoolConfig = {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASS || "postgres",
    port: Number(process.env.DB_PORT) || 5432,
    database: "postgres", // Conectamos a la BD por defecto
  };

  const adminPool = new Pool(adminPoolConfig);
  const client = await adminPool.connect();

  try {
    // Verificar si la BD existe
    const checkDbQuery = `
      SELECT 1 FROM pg_database 
      WHERE datname = $1
    `;
    const dbExists = await client.query(checkDbQuery, [dbName]);

    if (dbExists.rows.length === 0) {
      console.log(`🛠 Creando base de datos ${dbName}...`);

        const createDbQuery = `
            CREATE DATABASE "${dbName}"
            WITH OWNER = "${owner}"
            ENCODING = 'UTF8'
            LC_COLLATE = 'en_US.UTF-8'
            LC_CTYPE = 'en_US.UTF-8'
            TEMPLATE = template0
            CONNECTION LIMIT = -1;
        `;

          // Crear la BD con el owner especificado
          await client.query(createDbQuery);

      console.log(`✅ Base de datos ${dbName} creada con éxito`);

      // Otorgar todos los privilegios al owner
      await client.query(`GRANT ALL PRIVILEGES ON DATABASE "${dbName}" TO "${owner}";`);
    } else {
      console.log(`ℹ️ La base de datos ${dbName} ya existe`);
    }
  } catch (error) {
    console.error(
      `❌ Error al verificar/crear la base de datos ${dbName}:`,
      error
    );
    throw error;
  } finally {
    client.release();
    adminPool.end();
  }
}


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
        console.warn(`⚠️ Extensión '' no disponible`);
      } else {
        console.log(`✅ Extensión '' instalada`);
        await client.query(`CREATE EXTENSION IF NOT EXISTS ""`);
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
      // Primero verificar/crear la BD
      await createDatabaseIfNotExists(
        process.env.DB_NAME || "entalla",
        process.env.DB_USER || "entalla"
      );
      // Luego el resto de la inicialización
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


