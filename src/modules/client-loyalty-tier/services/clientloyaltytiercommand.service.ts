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
import { ClientLoyaltyTier } from "../entities/client-loyalty-tier.entity";
import { CreateClientLoyaltyTierDto, UpdateClientLoyaltyTierDto, DeleteClientLoyaltyTierDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ClientLoyaltyTierCommandRepository } from "../repositories/clientloyaltytiercommand.repository";
import { ClientLoyaltyTierQueryRepository } from "../repositories/clientloyaltytierquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ClientLoyaltyTierResponse, ClientLoyaltyTiersResponse } from "../types/clientloyaltytier.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ClientLoyaltyTierQueryService } from "./clientloyaltytierquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class ClientLoyaltyTierCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ClientLoyaltyTierCommandService.name);
  //Constructo del servicio ClientLoyaltyTierCommandService
  constructor(
    private readonly repository: ClientLoyaltyTierCommandRepository,
    private readonly queryRepository: ClientLoyaltyTierQueryRepository,
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
      .registerClient(ClientLoyaltyTierQueryService.name)
      .get(ClientLoyaltyTierQueryService.name),
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
        await this.eventStore.appendEvent('client-loyalty-tier-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: ClientLoyaltyTier | null,
    current?: ClientLoyaltyTier | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: loyalty-tier-min-points-non-negative
      // Los puntos mínimos deben ser mayores o iguales a 0
      if (!((this.dslValue(entityData, currentData, inputData, 'minPoints') === undefined || this.dslValue(entityData, currentData, inputData, 'minPoints') === null || this.dslValue(entityData, currentData, inputData, 'minPoints') >= 0))) {
        throw new Error('CLIENT_TIER_001: Los puntos mínimos del nivel no pueden ser negativos');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: loyalty-tier-min-points-non-negative
      // Los puntos mínimos deben ser mayores o iguales a 0
      if (!((this.dslValue(entityData, currentData, inputData, 'minPoints') === undefined || this.dslValue(entityData, currentData, inputData, 'minPoints') === null || this.dslValue(entityData, currentData, inputData, 'minPoints') >= 0))) {
        throw new Error('CLIENT_TIER_001: Los puntos mínimos del nivel no pueden ser negativos');
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
      .registerClient(ClientLoyaltyTierCommandService.name)
      .get(ClientLoyaltyTierCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateClientLoyaltyTierDto>("createClientLoyaltyTier", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createClientLoyaltyTierDtoInput: CreateClientLoyaltyTierDto
  ): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
    try {
      logger.info("Receiving in service:", createClientLoyaltyTierDtoInput);
      const candidate = ClientLoyaltyTier.fromDto(createClientLoyaltyTierDtoInput);
      await this.applyDslServiceRules("create", createClientLoyaltyTierDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createClientLoyaltyTierDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el clientloyaltytier no existe
      if (!entity)
        throw new NotFoundException("Entidad ClientLoyaltyTier no encontrada.");
      // Devolver clientloyaltytier
      return {
        ok: true,
        message: "ClientLoyaltyTier obtenido con éxito.",
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
      .registerClient(ClientLoyaltyTierCommandService.name)
      .get(ClientLoyaltyTierCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<ClientLoyaltyTier>("createClientLoyaltyTiers", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createClientLoyaltyTierDtosInput: CreateClientLoyaltyTierDto[]
  ): Promise<ClientLoyaltyTiersResponse<ClientLoyaltyTier>> {
    try {
      const entities = await this.repository.bulkCreate(
        createClientLoyaltyTierDtosInput.map((entity) => ClientLoyaltyTier.fromDto(entity))
      );

      // Respuesta si el clientloyaltytier no existe
      if (!entities)
        throw new NotFoundException("Entidades ClientLoyaltyTiers no encontradas.");
      // Devolver clientloyaltytier
      return {
        ok: true,
        message: "ClientLoyaltyTiers creados con éxito.",
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
      .registerClient(ClientLoyaltyTierCommandService.name)
      .get(ClientLoyaltyTierCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateClientLoyaltyTierDto>("updateClientLoyaltyTier", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateClientLoyaltyTierDto
  ): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new ClientLoyaltyTier(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el clientloyaltytier no existe
      if (!entity)
        throw new NotFoundException("Entidades ClientLoyaltyTiers no encontradas.");
      // Devolver clientloyaltytier
      return {
        ok: true,
        message: "ClientLoyaltyTier actualizada con éxito.",
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
      .registerClient(ClientLoyaltyTierCommandService.name)
      .get(ClientLoyaltyTierCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateClientLoyaltyTierDto>("updateClientLoyaltyTiers", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateClientLoyaltyTierDto[]
  ): Promise<ClientLoyaltyTiersResponse<ClientLoyaltyTier>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => ClientLoyaltyTier.fromDto(entity))
      );
      // Respuesta si el clientloyaltytier no existe
      if (!entities)
        throw new NotFoundException("Entidades ClientLoyaltyTiers no encontradas.");
      // Devolver clientloyaltytier
      return {
        ok: true,
        message: "ClientLoyaltyTiers actualizadas con éxito.",
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
      .registerClient(ClientLoyaltyTierCommandService.name)
      .get(ClientLoyaltyTierCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteClientLoyaltyTierDto>("deleteClientLoyaltyTier", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el clientloyaltytier no existe
      if (!entity)
        throw new NotFoundException("Instancias de ClientLoyaltyTier no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver clientloyaltytier
      return {
        ok: true,
        message: "Instancia de ClientLoyaltyTier eliminada con éxito.",
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
      .registerClient(ClientLoyaltyTierCommandService.name)
      .get(ClientLoyaltyTierCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteClientLoyaltyTiers", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

