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
import { ClientType } from "../entities/clienttype.entity";
import { CreateClientTypeDto, UpdateClientTypeDto, DeleteClientTypeDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ClientTypeCommandRepository } from "../repositories/clienttypecommand.repository";
import { ClientTypeQueryRepository } from "../repositories/clienttypequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ClientTypeResponse, ClientTypesResponse } from "../types/clienttype.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ClientTypeQueryService } from "./clienttypequery.service";

@Injectable()
export class ClientTypeCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ClientTypeCommandService.name);
  //Constructo del servicio ClientTypeCommandService
  constructor(
    private readonly repository: ClientTypeCommandRepository,
    private readonly queryRepository: ClientTypeQueryRepository,
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
      .registerClient(ClientTypeQueryService.name)
      .get(ClientTypeQueryService.name),
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
      .registerClient(ClientTypeCommandService.name)
      .get(ClientTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateClientTypeDto>("createClientType", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createClientTypeDtoInput: CreateClientTypeDto
  ): Promise<ClientTypeResponse<ClientType>> {
    try {
      logger.info("Receiving in service:", createClientTypeDtoInput);
      const entity = await this.repository.create(
        ClientType.fromDto(createClientTypeDtoInput)
      );
      logger.info("Entity created on service:", entity);
      // Respuesta si el clienttype no existe
      if (!entity)
        throw new NotFoundException("Entidad ClientType no encontrada.");
      // Devolver clienttype
      return {
        ok: true,
        message: "ClientType obtenido con éxito.",
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
      .registerClient(ClientTypeCommandService.name)
      .get(ClientTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<ClientType>("createClientTypes", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createClientTypeDtosInput: CreateClientTypeDto[]
  ): Promise<ClientTypesResponse<ClientType>> {
    try {
      const entities = await this.repository.bulkCreate(
        createClientTypeDtosInput.map((entity) => ClientType.fromDto(entity))
      );

      // Respuesta si el clienttype no existe
      if (!entities)
        throw new NotFoundException("Entidades ClientTypes no encontradas.");
      // Devolver clienttype
      return {
        ok: true,
        message: "ClientTypes creados con éxito.",
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
      .registerClient(ClientTypeCommandService.name)
      .get(ClientTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateClientTypeDto>("updateClientType", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateClientTypeDto
  ): Promise<ClientTypeResponse<ClientType>> {
    try {
      const entity = await this.repository.update(
        id,
        ClientType.fromDto(partialEntity)
      );
      // Respuesta si el clienttype no existe
      if (!entity)
        throw new NotFoundException("Entidades ClientTypes no encontradas.");
      // Devolver clienttype
      return {
        ok: true,
        message: "ClientType actualizada con éxito.",
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
      .registerClient(ClientTypeCommandService.name)
      .get(ClientTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateClientTypeDto>("updateClientTypes", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateClientTypeDto[]
  ): Promise<ClientTypesResponse<ClientType>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => ClientType.fromDto(entity))
      );
      // Respuesta si el clienttype no existe
      if (!entities)
        throw new NotFoundException("Entidades ClientTypes no encontradas.");
      // Devolver clienttype
      return {
        ok: true,
        message: "ClientTypes actualizadas con éxito.",
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
      .registerClient(ClientTypeCommandService.name)
      .get(ClientTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteClientTypeDto>("deleteClientType", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ClientTypeResponse<ClientType>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el clienttype no existe
      if (!entity)
        throw new NotFoundException("Instancias de ClientType no encontradas.");

      const result = await this.repository.delete(id);
      // Devolver clienttype
      return {
        ok: true,
        message: "Instancia de ClientType eliminada con éxito.",
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
      .registerClient(ClientTypeCommandService.name)
      .get(ClientTypeCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteClientTypes", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

