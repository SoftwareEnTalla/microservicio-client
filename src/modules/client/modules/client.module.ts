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
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { CacheModule } from "@nestjs/cache-manager";

//Interceptors
import { ClientInterceptor } from "../interceptors/client.interceptor";
import { ClientLoggingInterceptor } from "../interceptors/client.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { KafkaService } from "../shared/messaging/kafka.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]), // Asegúrate de incluir esto
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ClientCommandController, ClientQueryController],
  providers: [
    //Services
    EventStoreService,
    KafkaService,
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
    //Publishers
    KafkaEventPublisher,
    //Others dependencies
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
  exports: [
    //Services
    EventStoreService,
    KafkaService,
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
    //Publishers
    KafkaEventPublisher,
    //Others dependencies
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
})
export class ClientModule {}

