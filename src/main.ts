/*
 * Copyright (c) 2025 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ClientAppModule } from "./app.module";
import { AppDataSource, createDatabaseIfNotExists } from "./data-source";
import { INestApplication, Logger } from "@nestjs/common";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import 'tsconfig-paths/register';
import { ClientModule } from "@modules/client/modules/client.module";
import { setupSwagger } from "@config/swagger-config";
import * as dotenv from "dotenv";
import { logger } from '@core/logs/logger';

import { join } from "path";
import { loadEnv, watchEnvChanges } from "@core/loaders/load-enviroments";

const envPath = join(process.cwd(), ".env");
loadEnv(envPath);
watchEnvChanges(envPath);

// Método seguro para inspeccionar rutas
function printRoutes(app: INestApplication<any>) {
  const server = app.getHttpServer();
  const router = server._events.request._router;

  if (!router || (router && !router.stack)) {
    logger.warn("No se pudo acceder al router");
    return;
  }

  const routes = router.stack
    .filter((layer) => layer?.route)
    .map((layer) => ({
      path: (layer.route as any).path as string,
      methods: (layer.route as any).methods as Record<string, boolean>,
    }));

  logger.log("=== Rutas Registradas ===");
  routes.forEach((route) => {
    const methods = Object.keys(route.methods).filter((m) => route.methods[m]);
    // 
  });
}

async function bootstrap() {
  dotenv.config();
  const logger = new Logger("Bootstrap");

  try {
    await createDatabaseIfNotExists(
        process.env.DB_NAME || "entalla",
        process.env.DB_USER || "entalla"
    );
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.success("Database connection established");
    }
    logger.info(`ℹCreando instancia del módulo ClientAppModule...`);
    const app = await NestFactory.create(ClientAppModule, {
      // Configuración de logs
      bufferLogs: true, // Bufferiza logs hasta que el logger personalizado esté listo
      logger: process.env.NODE_ENV === 'production' 
        ? ['error', 'warn', 'log'] 
        : ['error', 'warn', 'debug', 'log', 'verbose'],
      
      // Configuración de rendimiento
      snapshot: process.env.NODE_ENV !== 'production', // Habilita snapshots en desarrollo
      abortOnError: false, // No abortar en errores de inicialización
      
      // Configuración HTTP
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'X-Requested-With',
          'Accept',
          'X-CSRF-Token'
        ],
        credentials: true,
        maxAge: 86400
      },
      
      // Configuración de parser
      bodyParser: true,
      rawBody: process.env.RAW_BODY === 'true', // Para webhooks/stripe
      
      // Configuración avanzada
      forceCloseConnections: true, // Cierra conexiones limpiamente en shutdown
      autoFlushLogs: true // Envía logs inmediatamente
    });
    app.enableShutdownHooks();
    const globalPrefix = "api";
    app.setGlobalPrefix(globalPrefix);
    
    const swaggerPath = setupSwagger(
      app,
      "api-docs",
      "Client Service API",
      "API completa para gestión de Clients con documentación automática",
      "1.0"
    );

    const port = process.env.PORT || 3000;
    const host = process.env.HOST || "localhost";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    await app.listen(port).then(() => {
      process.env.LOG_READY = "true";
      printRoutes(app);
    });
    logger.info(`ℹInstancia de aplicación escuchando por el puerto:port `);
    // Acceso seguro a las propiedades con type assertion
    const dbOptions = AppDataSource.options as PostgresConnectionOptions;

    logger.print(
      `\n` +
        `========================================\n` +
        `🚀 Aplicación ejecutándose\n` +
        `• Local:    ${protocol}://${host}:${port}\n` +
        `• API:      ${protocol}://${host}:${port}/${globalPrefix}\n` +
        `• Swagger:  ${protocol}://${host}:${port}/${swaggerPath}\n` +
        `• Entorno:  ${process.env.NODE_ENV || "development"}\n` +
        `----------------------------------------\n` +
        `📦 Base de datos:\n` +
        `• Nombre:   ${dbOptions.database}\n` +
        `• Servidor: ${dbOptions.host}:${dbOptions.port}\n` +
        `========================================`
    );
  } catch (error) {
    logger.error("Error al iniciar la aplicación", error);
    process.exit(1);
  }
}

bootstrap();


