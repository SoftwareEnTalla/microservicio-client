import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ClientAppModule } from "./app.module";
import { AppDataSource } from "./data-source";
import { Logger } from "@nestjs/common";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.log("✅ Database connection established");
    }

    const app = await NestFactory.create(ClientAppModule);
    app.enableShutdownHooks();
    const globalPrefix = "api";
    app.setGlobalPrefix(globalPrefix);

    const swaggerConfig = new DocumentBuilder()
      .setTitle("Client Service API")
      .setDescription("API for managing clients")
      .setVersion("1.0")
      .addTag("clients")
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    const swaggerPath = "api-docs";
    SwaggerModule.setup(swaggerPath, app, swaggerDocument);

    const port = process.env.PORT || 3000;
    const host = process.env.HOST || "localhost";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    await app.listen(port);

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
