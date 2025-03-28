import { Module } from "@nestjs/common";
import { ClientCommandController } from "../controllers/clientcommand.controller";
import { ClientCommandService } from "../services/clientcommand.service";
import { ClientCommandRepository } from "../repositories/clientcommand.repository";
import { ClientResolver } from "../graphql/client.resolver";
import { ClientAuthGuard } from "../guards/auth.guard";
import { ClientLoggingInterceptor } from "../interceptors/logging.interceptor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "../entities/client.entity";
import { ClientQueryService } from "../services/clientquery.service";
import { ClientQueryRepository } from "../repositories/clientquery.repository";
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { ModuleRef } from "@nestjs/core";

@Module({
  controllers: [ClientCommandController],
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [
    ClientCommandRepository,
    ClientQueryRepository,
    ClientQueryService,
    ClientCommandService,
    // ClientResolver,
    EventBus,
    CommandBus,
    UnhandledExceptionBus,
    ClientAuthGuard,
    ClientLoggingInterceptor,
  ],
  exports: [
    ClientCommandRepository,
    ClientCommandService, // Exportar el servicio si se usa en otros módulos
    TypeOrmModule, // Exportar TypeOrmModule si se necesitan los repositorios
  ], // Asegúrate de exportarlo si es necesario
})
export class ClientModule {}
