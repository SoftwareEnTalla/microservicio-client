import { ClientModule } from "@modules/client/modules/client.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(
  app,
  apiDoc: string = "api-docs",
  title: string = "Client Service API",
  description: string = "API completa para gestión de Clients con documentación automática",
  version: string = "1.0"
): string {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    // Organiza por módulos/funcionalidades
    //.addTag("Authentication", "Operaciones de autenticación y usuarios")
    .addTag("Clients", "Gestión de transacciones y procesamiento de pagos")
    //.addTag("Subscriptions", "Manejo de suscripciones recurrentes")
    //.addTag("Webhooks", "Endpoints para integraciones externas")
    //.addTag("Reports", "Generación de reportes y analytics")
    // Configuración de seguridad (ejemplo con JWT)
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Ingrese el token JWT",
        in: "header",
      },
      "JWT-auth" // Este nombre se usa como referencia en los decoradores
    )
    // Servidores (para diferentes entornos)
    .addServer("https://api.production.com", "Production")
    .addServer("https://api.staging.com", "Staging")
    .addServer("http://localhost:3000", "Local Development")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [ClientModule /*, AuthModule, ReportsModule*/], // Lista todos los módulos
    deepScanRoutes: true, // Escanea en profundidad
    ignoreGlobalPrefix: false, // Considera el prefijo global (api/)
    extraModels: [], // Puedes añadir modelos adicionales si es necesario
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}_${methodKey}`, // Genera IDs únicos
  });

  SwaggerModule.setup(apiDoc, app, swaggerDocument, {
    explorer: true, // Permite búsqueda
    swaggerOptions: {
      docExpansion: "list", // 'none', 'list' o 'full'
      filter: true, // Permite filtrar por tag
      showRequestDuration: true, // Muestra tiempo de ejecución
      persistAuthorization: true, // Guarda token entre sesiones
      tagsSorter: "alpha", // Ordena tags alfabéticamente
      operationsSorter: "alpha", // Ordena operaciones alfabéticamente
      defaultModelExpandDepth: 3, // Profundidad de modelos mostrados
      defaultModelsExpandDepth: 3,
      displayRequestDuration: true,
    },
    customCss: ".swagger-ui .topbar { background-color: #2c3e50; }", // Personalización
    customSiteTitle: "Client API Docs",
    customfavIcon: "/favicon.ico",
  });
  return apiDoc;
}



