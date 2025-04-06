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


@Module({
  imports: [
    TypeOrmModule.forFeature([Client]), // Asegúrate de incluir esto
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ClientCommandController, ClientQueryController],
  providers: [
    ClientQueryService,
    ClientCommandService,
    ClientCommandRepository,
    ClientQueryRepository,
    ClientRepository,
    ClientResolver,
    ClientAuthGuard,
    ClientInterceptor,
    ClientLoggingInterceptor,
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
  exports: [
    ClientQueryService,
    ClientCommandService,
    ClientCommandRepository,
    ClientQueryRepository,
    ClientRepository,
    ClientResolver,
    ClientAuthGuard,
    ClientInterceptor,
    ClientLoggingInterceptor,
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
})
export class ClientModule {}

