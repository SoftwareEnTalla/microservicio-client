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
import { ClientSegmentCommandController } from "../controllers/clientsegmentcommand.controller";
import { ClientSegmentQueryController } from "../controllers/clientsegmentquery.controller";
import { ClientSegmentCommandService } from "../services/clientsegmentcommand.service";
import { ClientSegmentQueryService } from "../services/clientsegmentquery.service";
import { ClientSegmentCommandRepository } from "../repositories/clientsegmentcommand.repository";
import { ClientSegmentQueryRepository } from "../repositories/clientsegmentquery.repository";
import { ClientSegmentRepository } from "../repositories/clientsegment.repository";
import { ClientSegmentResolver } from "../graphql/clientsegment.resolver";
import { ClientSegmentAuthGuard } from "../guards/clientsegmentauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientSegment } from "../entities/client-segment.entity";
import { BaseEntity } from "../entities/base.entity";
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { CacheModule } from "@nestjs/cache-manager";

//Interceptors
import { ClientSegmentInterceptor } from "../interceptors/clientsegment.interceptor";
import { ClientSegmentLoggingInterceptor } from "../interceptors/clientsegment.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { KafkaService } from "../shared/messaging/kafka.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([BaseEntity, ClientSegment]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ClientSegmentCommandController, ClientSegmentQueryController],
  providers: [
    //Services
    EventStoreService,
    KafkaService,
    ClientSegmentQueryService,
    ClientSegmentCommandService,
    //Repositories
    ClientSegmentCommandRepository,
    ClientSegmentQueryRepository,
    ClientSegmentRepository,      
    //Resolvers
    ClientSegmentResolver,
    //Guards
    ClientSegmentAuthGuard,
    //Interceptors
    ClientSegmentInterceptor,
    ClientSegmentLoggingInterceptor,
    //Publishers
    KafkaEventPublisher,
    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED === 'true',
        kafkaEnabled: process.env.KAFKA_ENABLED === 'true',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: ['clientsegment-events']
      })
    },
    //Others dependencies
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
  exports: [
    //Services
    EventStoreService,
    KafkaService,
    ClientSegmentQueryService,
    ClientSegmentCommandService,
    //Repositories
    ClientSegmentCommandRepository,
    ClientSegmentQueryRepository,
    ClientSegmentRepository,      
    //Resolvers
    ClientSegmentResolver,
    //Guards
    ClientSegmentAuthGuard,
    //Interceptors
    ClientSegmentInterceptor,
    ClientSegmentLoggingInterceptor,
    //Publishers
    KafkaEventPublisher,
    //Others dependencies
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
})
export class ClientSegmentModule {}

