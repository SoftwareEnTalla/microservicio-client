import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ClientAppModule } from "./app.module";
import { AppDataSource, createDatabaseIfNotExists } from "./data-source";
import { INestApplication, Logger } from "@nestjs/common";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import 'tsconfig-paths/register';
import { ClientModule } from "@modules/client/modules/client.module";
import { setupSwagger } from "@config/swagger-config";

// Método seguro para inspeccionar rutas
function printRoutes(app: INestApplication<any>) {
  const server = app.getHttpServer();
  const router = server._events.request._router;

  if (!router || !router.stack) {
    console.warn("No se pudo acceder al router");
    return;
  }

  const routes = router.stack
    .filter((layer) => layer?.route)
    .map((layer) => ({
      path: (layer.route as any).path as string,
      methods: (layer.route as any).methods as Record<string, boolean>,
    }));

  console.log("=== Rutas Registradas ===");
  routes.forEach((route) => {
    const methods = Object.keys(route.methods).filter((m) => route.methods[m]);
    // 
  });
}

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  try {
    await createDatabaseIfNotExists(
        process.env.DB_NAME || "entalla",
        process.env.DB_USER || "entalla"
    );
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.log("✅ Database connection established");
    }
    console.log(`ℹ️ Creando instancia del módulo ClientAppModule...`);
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
      printRoutes(app);
    });
    console.log(`ℹ️ Instancia de aplicación escuchando por el puerto:port `);
    // Acceso seguro a las propiedades con type assertion
    const dbOptions = AppDataSource.options as PostgresConnectionOptions;

    logger.log(
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
    logger.error("❌ Error al iniciar la aplicación", error);
    process.exit(1);
  }
}

bootstrap();


