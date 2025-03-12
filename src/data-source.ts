import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres", // Asegúrate de que este tipo coincide con tu base de datos
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "entalla",
  password: process.env.DB_PASS || "entalla",
  database: process.env.DB_NAME || "entalla",
  synchronize: true, // Solo para desarrollo, en producción usa migrations
  logging: true,
  entities: [__dirname + "/**/*.entity.{ts,js}"],
  migrations: [__dirname + "/migrations/**/*.{ts,js}"],
  migrationsTableName: "migrations_history",
});

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Base de datos conectada correctamente");
  })
  .catch((error) => {
    console.error("❌ Error conectando la base de datos:", error);
  });
