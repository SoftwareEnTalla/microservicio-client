import { DynamicModule, Module } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ClientCommandController } from "./modules/client/controllers/clientcommand.controller";
import { ClientModule } from "./modules/client/modules/client.module";
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { AppDataSource, initializeDatabase } from "./data-source";
import { ClientQueryController } from "./modules/client/controllers/clientquery.controller";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ClientCommandService } from "./modules/client/services/clientcommand.service";
import { ClientQueryService } from "./modules/client/services/clientquery.service";
import { CacheModule } from "@nestjs/cache-manager";
import { LoggingModule } from "./modules/client/modules/logger.module";
//import GraphQLJSON from "graphql-type-json";

/*
//TODO unused for while dependencies
import { I18nModule } from "nestjs-i18n";
import { join } from "path";
import { CustomI18nLoader } from "./core/loaders/custom-I18n-Loader";
import { TranslocoService } from "@jsverse/transloco";
import { HeaderResolver, AcceptLanguageResolver } from "nestjs-i18n";
import { TranslocoWrapperService } from "./core/services/transloco-wrapper.service";
import { TranslocoModule } from "@ngneat/transloco";

*/

@Module({
  imports: [
    // Se importa/registra el módulo de caché
    CacheModule.register(),

    /**
     * ConfigModule - Configuración global de variables de entorno
     *
     * Configuración centralizada para el manejo de variables de entorno.
     * Se establece como global para estar disponible en toda la aplicación.
     */
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en todos los módulos sin necesidad de importar
      envFilePath: ".env", // Ubicación del archivo .env
      cache: true, // Mejora rendimiento cacheando las variables
      expandVariables: true, // Permite usar variables anidadas (ej: )
    }),

    /**
     * TypeOrmModule - Configuración de la base de datos
     *
     * Conexión asíncrona con PostgreSQL y configuración avanzada.
     * Se inicializa primero la conexión a la base de datos.
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Requiere ConfigModule para variables de entorno
      useFactory: async () => {
        const dataSource = await initializeDatabase(); // Inicializa conexión
        return {
          ...dataSource.options, // Configuración base del DataSource
          autoLoadEntities: true, // Carga automática de entidades
          retryAttempts: 5, // Intentos de reconexión en caso de fallo
          retryDelay: 3000, // Tiempo entre intentos (3 segundos)
          synchronize: process.env.NODE_ENV !== "production", // Sincroniza esquema solo en desarrollo
          logging: process.env.DB_LOGGING === "true", // Logging configurable
        };
      },
    }),

    /**
     * Módulos Client de la aplicación
     */
    ClientModule,
    /**
     * Módulo Logger de la aplicación
     */
    LoggingModule,

    // Módulo GraphQLModule para Client
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      //autoSchemaFile: "schema.gql", // Opcional: genera un archivo de esquema
      autoSchemaFile: true,
      buildSchemaOptions: {
        dateScalarMode: "timestamp",
      },
      // resolvers: { JSON: GraphQLJSON }, // Añade esta línea
    }),
  ],

  /**
   * Controladores de Client
   *
   * Registro de controladores a nivel de aplicación.
   */
  controllers: [
  //No se recomienda habilitar los controladores si ya fueron declarados en el módulo: ClientModule
  /*
  
  ClientCommandController, 
  ClientQueryController
  
  */
  ],

  /**
   * Proveedores (Servicios, Repositorios, etc.) de Client
   *
   * Registro de servicios globales y configuración de inyección de dependencias.
   */
  providers: [
    // Sistema CQRS
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
    // Configuración de Base de datos
    {
      provide: DataSource, // Token para inyección
      useValue: AppDataSource, // Instancia singleton del DataSource
    },
    // Se importan los servicios del módulo
    ClientCommandService,
    ClientQueryService,
  ],

  /**
   * Exportaciones de módulos y servicios
   *
   * Hace disponibles módulos y servicios para otros módulos que importen este módulo.
   */
  exports: [ClientCommandService, ClientQueryService],
})
export class ClientAppModule {
  /**
   * Constructor del módulo principal
   * @param dataSource Instancia inyectada del DataSource
   * @param translocoService Servicio para manejo de idiomas
   */
  constructor(
    private readonly dataSource: DataSource
    //private readonly translocoService: TranslocoService
  ) {
    this.checkDatabaseConnection();
    this.setupLanguageChangeHandling();
  }

  /**
   * Verifica la conexión a la base de datos al iniciar
   *
   * Realiza una consulta simple para confirmar que la conexión está activa.
   * Termina la aplicación si no puede establecer conexión.
   */
  private async checkDatabaseConnection() {
    try {
      await this.dataSource.query("SELECT 1");
      console.log("✅ Conexión a la base de datos verificada correctamente");
    } catch (error) {
      console.error(
        "❌ Error crítico: No se pudo conectar a la base de datos",
        error
      );
      process.exit(1); // Termina la aplicación con código de error
    }
  }

  /**
   * Configura el manejo de cambios de idioma
   *
   * Suscribe a eventos de cambio de idioma para mantener consistencia.
   */
  private setupLanguageChangeHandling() {}
}


