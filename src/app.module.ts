import { DynamicModule, Module } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ClientCommandController } from "./modules/client/controllers/clientcommand.controller";
import { ClientModule } from "./modules/client/modules/client.module";
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { AppDataSource, initializeDatabase } from "./data-source";
import { I18nModule } from "nestjs-i18n";
import { join } from "path";
import { CustomI18nLoader } from "./core/loaders/custom-I18n-Loader";
import { TranslocoService } from "@jsverse/transloco";
import { HeaderResolver, AcceptLanguageResolver } from "nestjs-i18n";
import { TranslocoWrapperService } from "./core/services/transloco-wrapper.service";
import { TranslocoModule } from "@ngneat/transloco";

@Module({
  imports: [
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
      expandVariables: true, // Permite usar variables anidadas (ej: ${DB_HOST})
    }),

    /**
     * I18nModule - Internacionalización y localización
     *
     * Configuración completa para manejo de múltiples idiomas.
     * Incluye carga de traducciones desde archivos JSON y detección automática de idioma.
     */
    /*  I18nModule.forRootAsync({
      loader: CustomI18nLoader,
      useFactory: (translocoWrapper: TranslocoWrapperService) => ({
        fallbackLanguage: translocoWrapper
          .getTranslocoService()
          .getDefaultLang(),
        loaderOptions: {
          path: join(process.cwd(), "i18n"),
          watch: process.env.NODE_ENV === "development",
        },
        typesOutputPath: join(process.cwd(), "src/generated/i18n-types.ts"),
        throwOnMissingKey: true,
      }),
      inject: [TranslocoWrapperService],
    }),*/

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
     * Módulos de la aplicación
     */
    ClientModule, // Módulo principal de funcionalidad de clientes
  ],

  /**
   * Controladores
   *
   * Registro de controladores a nivel de aplicación.
   */
  controllers: [ClientCommandController],

  /**
   * Proveedores (Servicios, Repositorios, etc.)
   *
   * Registro de servicios globales y configuración de inyección de dependencias.
   */
  providers: [
    // Sistema CQRS
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos

    // Internacionalización
    // CustomI18nLoader, // Cargador personalizado de traducciones
    //  TranslocoService, // Servicio de Transloco para manejo de idiomas
    // TranslocoWrapperService,
    // Base de datos
    {
      provide: DataSource, // Token para inyección
      useValue: AppDataSource, // Instancia singleton del DataSource
    },
  ],

  /**
   * Exportaciones
   *
   * Hace disponibles módulos y servicios para otros módulos que importen este módulo.
   */
  exports: [
    // Exporta el módulo de internacionalización
    // I18nModule,
    // TranslocoWrapperService,
  ],
})
export class ClientAppModule {
  /* static forRoot(): DynamicModule {
    return {
      module: TranslocoModule,
      providers: [TranslocoWrapperService],
      exports: [TranslocoWrapperService],
      global: true,
    };
  }*/

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
  private setupLanguageChangeHandling() {
    /* this.translocoService.langChanges$.subscribe({
      next: (lang) => {
        console.log(`🌐 Idioma cambiado a: ${lang}`);
        // Aquí puedes añadir lógica adicional al cambiar idioma
      },
      error: (err) => console.error("Error en observador de idioma:", err),
    });*/
  }
}
