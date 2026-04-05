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


import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { Client } from "../entities/client.entity";
import { CreateClientDto, UpdateClientDto, DeleteClientDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ClientCommandRepository } from "../repositories/clientcommand.repository";
import { ClientQueryRepository } from "../repositories/clientquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ClientResponse, ClientsResponse } from "../types/client.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ClientQueryService } from "./clientquery.service";
import { BaseEvent } from "../events/base.event";
import { ClientHighCreditLimitDetectedEvent } from '../events/clienthighcreditlimitdetected.event';

@Injectable()
export class ClientCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ClientCommandService.name);
  //Constructo del servicio ClientCommandService
  constructor(
    private readonly repository: ClientCommandRepository,
    private readonly queryRepository: ClientQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private moduleRef: ModuleRef
  ) {
    //Inicialice aquí propiedades o atributos
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }

  private dslValue(entityData: Record<string, any>, currentData: Record<string, any>, inputData: Record<string, any>, field: string): any {
    return entityData?.[field] ?? currentData?.[field] ?? inputData?.[field];
  }

  private async publishDslDomainEvents(events: BaseEvent[]): Promise<void> {
    for (const event of events) {
      await this.eventPublisher.publish(event as any);
      if (process.env.EVENT_STORE_ENABLED === "true") {
        await this.eventStore.appendEvent(, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Client | null,
    current?: Client | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: credit-limit-must-be-non-negative
      // El límite de crédito debe ser mayor o igual a 0
      if (!((this.dslValue(entityData, currentData, inputData, 'creditLimit') === undefined || this.dslValue(entityData, currentData, inputData, 'creditLimit') === null || this.dslValue(entityData, currentData, inputData, 'creditLimit') >= 0))) {
        throw new Error('CLIENT_001: El límite de crédito no puede ser negativo');
      }

      // Regla de servicio: active-client-requires-email
      // Si el cliente se activa debe existir correo principal
      if (!(this.dslValue(entityData, currentData, inputData, 'isActive') === true && (this.dslValue(entityData, currentData, inputData, 'email') !== undefined && this.dslValue(entityData, currentData, inputData, 'email') !== null && this.dslValue(entityData, currentData, inputData, 'email') !== ''))) {
        logger.warn('CLIENT_002: Se recomienda definir correo principal para clientes activos');
      }

      // Regla de servicio: high-credit-limit-emits-domain-event
      // Cuando el límite de crédito sea alto se debe emitir un evento de dominio
      if ((this.dslValue(entityData, currentData, inputData, 'creditLimit') === undefined || this.dslValue(entityData, currentData, inputData, 'creditLimit') === null || this.dslValue(entityData, currentData, inputData, 'creditLimit') >= 10000)) {
        pendingEvents.push(ClientHighCreditLimitDetectedEvent.create(
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'client-create'),
          (entity ?? current ?? inputData ?? {}) as any,
          String(entityData['createdBy'] ?? currentData['createdBy'] ?? inputData?.createdBy ?? 'system'),
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'client-create')
        ));
      }

    }

    if (operation === 'update') {
      // Regla de servicio: credit-limit-must-be-non-negative
      // El límite de crédito debe ser mayor o igual a 0
      if (!((this.dslValue(entityData, currentData, inputData, 'creditLimit') === undefined || this.dslValue(entityData, currentData, inputData, 'creditLimit') === null || this.dslValue(entityData, currentData, inputData, 'creditLimit') >= 0))) {
        throw new Error('CLIENT_001: El límite de crédito no puede ser negativo');
      }

      // Regla de servicio: active-client-requires-email
      // Si el cliente se activa debe existir correo principal
      if (!(this.dslValue(entityData, currentData, inputData, 'isActive') === true && (this.dslValue(entityData, currentData, inputData, 'email') !== undefined && this.dslValue(entityData, currentData, inputData, 'email') !== null && this.dslValue(entityData, currentData, inputData, 'email') !== ''))) {
        logger.warn('CLIENT_002: Se recomienda definir correo principal para clientes activos');
      }

      // Regla de servicio: high-credit-limit-emits-domain-event
      // Cuando el límite de crédito sea alto se debe emitir un evento de dominio
      if ((this.dslValue(entityData, currentData, inputData, 'creditLimit') === undefined || this.dslValue(entityData, currentData, inputData, 'creditLimit') === null || this.dslValue(entityData, currentData, inputData, 'creditLimit') >= 10000)) {
        pendingEvents.push(ClientHighCreditLimitDetectedEvent.create(
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'client-update'),
          (entity ?? current ?? inputData ?? {}) as any,
          String(entityData['createdBy'] ?? currentData['createdBy'] ?? inputData?.createdBy ?? 'system'),
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'client-update')
        ));
      }

    }
    if (publishEvents) {
      await this.publishDslDomainEvents(pendingEvents);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientCommandService.name)
      .get(ClientCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateClientDto>("createClient", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createClientDtoInput: CreateClientDto
  ): Promise<ClientResponse<Client>> {
    try {
      logger.info("Receiving in service:", createClientDtoInput);
      const candidate = Client.fromDto(createClientDtoInput);
      await this.applyDslServiceRules("create", createClientDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createClientDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el client no existe
      if (!entity)
        throw new NotFoundException("Entidad Client no encontrada.");
      // Devolver client
      return {
        ok: true,
        message: "Client obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      logger.info("Error creating entity on service:", error);
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientCommandService.name)
      .get(ClientCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Client>("createClients", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createClientDtosInput: CreateClientDto[]
  ): Promise<ClientsResponse<Client>> {
    try {
      const entities = await this.repository.bulkCreate(
        createClientDtosInput.map((entity) => Client.fromDto(entity))
      );

      // Respuesta si el client no existe
      if (!entities)
        throw new NotFoundException("Entidades Clients no encontradas.");
      // Devolver client
      return {
        ok: true,
        message: "Clients creados con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientCommandService.name)
      .get(ClientCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateClientDto>("updateClient", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateClientDto
  ): Promise<ClientResponse<Client>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Client(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el client no existe
      if (!entity)
        throw new NotFoundException("Entidades Clients no encontradas.");
      // Devolver client
      return {
        ok: true,
        message: "Client actualizada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientCommandService.name)
      .get(ClientCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateClientDto>("updateClients", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateClientDto[]
  ): Promise<ClientsResponse<Client>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Client.fromDto(entity))
      );
      // Respuesta si el client no existe
      if (!entities)
        throw new NotFoundException("Entidades Clients no encontradas.");
      // Devolver client
      return {
        ok: true,
        message: "Clients actualizadas con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

   @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientCommandService.name)
      .get(ClientCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteClientDto>("deleteClient", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ClientResponse<Client>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el client no existe
      if (!entity)
        throw new NotFoundException("Instancias de Client no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver client
      return {
        ok: true,
        message: "Instancia de Client eliminada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientCommandService.name)
      .get(ClientCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteClients", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

