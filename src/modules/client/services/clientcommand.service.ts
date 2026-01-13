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
      const entity = await this.repository.create(
        Client.fromDto(createClientDtoInput)
      );
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
      const entity = await this.repository.update(
        id,
        Client.fromDto(partialEntity)
      );
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

      const result = await this.repository.delete(id);
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

