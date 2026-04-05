/*
 * Copyright (c) 2026 SoftwarEnTalla
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


import { Module } from "@nestjs/common";
import { ClientCommandController } from "../controllers/clientcommand.controller";
import { ClientQueryController } from "../controllers/clientquery.controller";
import { ClientCommandService } from "../services/clientcommand.service";
import { ClientQueryService } from "../services/clientquery.service";
import { ClientCommandRepository } from "../repositories/clientcommand.repository";
import { ClientQueryRepository } from "../repositories/clientquery.repository";
import { ClientRepository } from "../repositories/client.repository";
import { ClientResolver } from "../graphql/client.resolver";
import { ClientAuthGuard } from "../guards/clientauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "../entities/client.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateClientHandler } from "../commands/handlers/createclient.handler";
import { UpdateClientHandler } from "../commands/handlers/updateclient.handler";
import { DeleteClientHandler } from "../commands/handlers/deleteclient.handler";
import { GetClientByIdHandler } from "../queries/handlers/getclientbyid.handler";
import { GetClientByFieldHandler } from "../queries/handlers/getclientbyfield.handler";
import { GetAllClientHandler } from "../queries/handlers/getallclient.handler";
import { ClientCrudSaga } from "../sagas/client-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ClientInterceptor } from "../interceptors/client.interceptor";
import { ClientLoggingInterceptor } from "../interceptors/client.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Client]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ClientCommandController, ClientQueryController],
  providers: [
    //Services
    EventStoreService,
    ClientQueryService,
    ClientCommandService,
    //Repositories
    ClientCommandRepository,
    ClientQueryRepository,
    ClientRepository,      
    //Resolvers
    ClientResolver,
    //Guards
    ClientAuthGuard,
    //Interceptors
    ClientInterceptor,
    ClientLoggingInterceptor,
    //CQRS Handlers
    CreateClientHandler,
    UpdateClientHandler,
    DeleteClientHandler,
    GetClientByIdHandler,
    GetClientByFieldHandler,
    GetAllClientHandler,
    ClientCrudSaga,
    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED !== 'false',
        kafkaEnabled: process.env.KAFKA_ENABLED !== 'false',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: EVENT_TOPICS
      })
    },
  ],
  exports: [
    CqrsModule,
    KafkaModule,
    //Services
    EventStoreService,
    ClientQueryService,
    ClientCommandService,
    //Repositories
    ClientCommandRepository,
    ClientQueryRepository,
    ClientRepository,      
    //Resolvers
    ClientResolver,
    //Guards
    ClientAuthGuard,
    //Interceptors
    ClientInterceptor,
    ClientLoggingInterceptor,
  ],
})
export class ClientModule {}

