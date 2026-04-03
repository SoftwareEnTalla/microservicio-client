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
      const entity = await this.repository.create(
        ClientLoyaltyTier.fromDto(createClientLoyaltyTierDtoInput)
      );
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
      const entity = await this.repository.update(
        id,
        ClientLoyaltyTier.fromDto(partialEntity)
      );
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

      const result = await this.repository.delete(id);
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

