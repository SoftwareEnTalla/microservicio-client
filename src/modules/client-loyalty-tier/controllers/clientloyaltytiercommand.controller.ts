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


import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Get,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";
import { ClientLoyaltyTierCommandService } from "../services/clientloyaltytiercommand.service";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { ClientLoyaltyTier } from "../entities/client-loyalty-tier.entity";
import { ClientLoyaltyTierResponse, ClientLoyaltyTiersResponse } from "../types/clientloyaltytier.types";
import { CreateClientLoyaltyTierDto, UpdateClientLoyaltyTierDto } from "../dtos/all-dto"; 

//Loggers
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { logger } from '@core/logs/logger';

import { BadRequestException } from "@nestjs/common";

import { CommandBus } from "@nestjs/cqrs";
//import { ClientLoyaltyTierCreatedEvent } from "../events/clientloyaltytiercreated.event";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";

@ApiTags("ClientLoyaltyTier Command")
@Controller("clientloyaltytiers/command")
export class ClientLoyaltyTierCommandController {

  #logger = new Logger(ClientLoyaltyTierCommandController.name);

  //Constructor del controlador: ClientLoyaltyTierCommandController
  constructor(
  private readonly service: ClientLoyaltyTierCommandService,
  private readonly commandBus: CommandBus,
  private readonly eventStore: EventStoreService,
  private readonly eventPublisher: KafkaEventPublisher
  ) {
    //Coloca aquí la lógica que consideres necesaria para inicializar el controlador
  }

  @ApiOperation({ summary: "Create a new clientloyaltytier" })
  @ApiBody({ type: CreateClientLoyaltyTierDto })
  @ApiResponse({ status: 201, type: ClientLoyaltyTierResponse<ClientLoyaltyTier> })
  @Post()
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ClientLoyaltyTierCommandController.name)
      .get(ClientLoyaltyTierCommandController.name),
  })
  async create(
    @Body() createClientLoyaltyTierDtoInput: CreateClientLoyaltyTierDto
  ): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
    try {
      logger.info("Receiving in controller:", createClientLoyaltyTierDtoInput);
      const entity = await this.service.create(createClientLoyaltyTierDtoInput);
      logger.info("Entity created on controller:", entity);
      if (!entity) {
        throw new NotFoundException("Response clientloyaltytier entity not found.");
      } else if (!entity.data) {
        throw new NotFoundException("ClientLoyaltyTier entity not found on response.");
      } else if (!entity.data.id) {
        throw new NotFoundException("Id clientloyaltytier is null on order instance.");
      }     

      return entity;
    } catch (error) {
      logger.info("Error creating entity on controller:", error);
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Create multiple clientloyaltytiers" })
  @ApiBody({ type: [CreateClientLoyaltyTierDto] })
  @ApiResponse({ status: 201, type: ClientLoyaltyTiersResponse<ClientLoyaltyTier> })
  @Post("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ClientLoyaltyTierCommandController.name)
      .get(ClientLoyaltyTierCommandController.name),
  })
  async bulkCreate(
    @Body() createClientLoyaltyTierDtosInput: CreateClientLoyaltyTierDto[]
  ): Promise<ClientLoyaltyTiersResponse<ClientLoyaltyTier>> {
    try {
      const entities = await this.service.bulkCreate(createClientLoyaltyTierDtosInput);

      if (!entities) {
        throw new NotFoundException("ClientLoyaltyTier entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update an clientloyaltytier" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdateClientLoyaltyTierDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: ClientLoyaltyTierResponse<ClientLoyaltyTier> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia ClientLoyaltyTier a actualizar.",
  }) // ✅ Nuevo status para el error de validación
  @Put(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ClientLoyaltyTierCommandController.name)
      .get(ClientLoyaltyTierCommandController.name),
  })
  async update(
    @Param("id") id: string,
    @Body() body: any
  ): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
    try {
      // Permitir body plano o anidado en 'data'
      const partialEntity = body?.data ? body.data : body;
      // ✅ Validación de coincidencia de IDs
      if (partialEntity?.id && id !== partialEntity.id) {

        throw new BadRequestException(

          "El ID en la URL no coincide con el ID en la instancia de ClientLoyaltyTier a actualizar."

        );

      }

      if (partialEntity && !partialEntity.id) { partialEntity.id = id; }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de ClientLoyaltyTier no encontrada.");
      }

      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple clientloyaltytiers" })
  @ApiBody({ type: [UpdateClientLoyaltyTierDto] })
  @ApiResponse({ status: 200, type: ClientLoyaltyTiersResponse<ClientLoyaltyTier> })
  @Put("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ClientLoyaltyTierCommandController.name)
      .get(ClientLoyaltyTierCommandController.name),
  })
  async bulkUpdate(
    @Body() partialEntities: UpdateClientLoyaltyTierDto[]
  ): Promise<ClientLoyaltyTiersResponse<ClientLoyaltyTier>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("ClientLoyaltyTier entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete an clientloyaltytier" })   
  @ApiResponse({ status: 200, type: ClientLoyaltyTierResponse<ClientLoyaltyTier>,description:
    "Instancia de ClientLoyaltyTier eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia ClientLoyaltyTier a eliminar.",
  }) // ✅ Nuevo status para el error de validación
  @Delete(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ClientLoyaltyTierCommandController.name)
      .get(ClientLoyaltyTierCommandController.name),
  })
  async delete(@Param("id") id: string): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
    try {
       
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("ClientLoyaltyTier entity not found.");
      }

      return result;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete multiple clientloyaltytiers" })
  @ApiResponse({ status: 200, type: DeleteResult })
  @Delete("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ClientLoyaltyTierCommandController.name)
      .get(ClientLoyaltyTierCommandController.name),
  })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

