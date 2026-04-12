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
import { ClientLoyaltyTierCommandController } from "../controllers/clientloyaltytiercommand.controller";
import { ClientLoyaltyTierQueryController } from "../controllers/clientloyaltytierquery.controller";
import { ClientLoyaltyTierCommandService } from "../services/clientloyaltytiercommand.service";
import { ClientLoyaltyTierQueryService } from "../services/clientloyaltytierquery.service";
import { ClientLoyaltyTierCommandRepository } from "../repositories/clientloyaltytiercommand.repository";
import { ClientLoyaltyTierQueryRepository } from "../repositories/clientloyaltytierquery.repository";
import { ClientLoyaltyTierRepository } from "../repositories/clientloyaltytier.repository";
import { ClientLoyaltyTierResolver } from "../graphql/clientloyaltytier.resolver";
import { ClientLoyaltyTierAuthGuard } from "../guards/clientloyaltytierauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientLoyaltyTier } from "../entities/client-loyalty-tier.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateClientLoyaltyTierHandler } from "../commands/handlers/createclientloyaltytier.handler";
import { UpdateClientLoyaltyTierHandler } from "../commands/handlers/updateclientloyaltytier.handler";
import { DeleteClientLoyaltyTierHandler } from "../commands/handlers/deleteclientloyaltytier.handler";
import { GetClientLoyaltyTierByIdHandler } from "../queries/handlers/getclientloyaltytierbyid.handler";
import { GetClientLoyaltyTierByFieldHandler } from "../queries/handlers/getclientloyaltytierbyfield.handler";
import { GetAllClientLoyaltyTierHandler } from "../queries/handlers/getallclientloyaltytier.handler";
import { ClientLoyaltyTierCrudSaga } from "../sagas/clientloyaltytier-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ClientLoyaltyTierInterceptor } from "../interceptors/clientloyaltytier.interceptor";
import { ClientLoyaltyTierLoggingInterceptor } from "../interceptors/clientloyaltytier.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ClientLoyaltyTier]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ClientLoyaltyTierCommandController, ClientLoyaltyTierQueryController],
  providers: [
    //Services
    EventStoreService,
    ClientLoyaltyTierQueryService,
    ClientLoyaltyTierCommandService,
    //Repositories
    ClientLoyaltyTierCommandRepository,
    ClientLoyaltyTierQueryRepository,
    ClientLoyaltyTierRepository,      
    //Resolvers
    ClientLoyaltyTierResolver,
    //Guards
    ClientLoyaltyTierAuthGuard,
    //Interceptors
    ClientLoyaltyTierInterceptor,
    ClientLoyaltyTierLoggingInterceptor,
    //CQRS Handlers
    CreateClientLoyaltyTierHandler,
    UpdateClientLoyaltyTierHandler,
    DeleteClientLoyaltyTierHandler,
    GetClientLoyaltyTierByIdHandler,
    GetClientLoyaltyTierByFieldHandler,
    GetAllClientLoyaltyTierHandler,
    ClientLoyaltyTierCrudSaga,
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
    ClientLoyaltyTierQueryService,
    ClientLoyaltyTierCommandService,
    //Repositories
    ClientLoyaltyTierCommandRepository,
    ClientLoyaltyTierQueryRepository,
    ClientLoyaltyTierRepository,      
    //Resolvers
    ClientLoyaltyTierResolver,
    //Guards
    ClientLoyaltyTierAuthGuard,
    //Interceptors
    ClientLoyaltyTierInterceptor,
    ClientLoyaltyTierLoggingInterceptor,
  ],
})
export class ClientLoyaltyTierModule {}

