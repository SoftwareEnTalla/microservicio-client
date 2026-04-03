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


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

//Definición de entidades
import { ClientType } from "../entities/client-type.entity";

//Definición de comandos
import {
  CreateClientTypeCommand,
  UpdateClientTypeCommand,
  DeleteClientTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ClientTypeQueryService } from "../services/clienttypequery.service";


import { ClientTypeResponse, ClientTypesResponse } from "../types/clienttype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateClientTypeDto, 
CreateOrUpdateClientTypeDto, 
ClientTypeValueInput, 
ClientTypeDto, 
CreateClientTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ClientType)
export class ClientTypeResolver {

   //Constructor del resolver de ClientType
  constructor(
    private readonly service: ClientTypeQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(ClientTypeResolver.name)

      .get(ClientTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => ClientTypeResponse<ClientType>)
  async createClientType(
    @Args("input", { type: () => CreateClientTypeDto }) input: CreateClientTypeDto
  ): Promise<ClientTypeResponse<ClientType>> {
    return this.commandBus.execute(new CreateClientTypeCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(ClientTypeResolver.name)

      .get(ClientTypeResolver.name),
    })
  @Mutation(() => ClientTypeResponse<ClientType>)
  async updateClientType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateClientTypeDto
  ): Promise<ClientTypeResponse<ClientType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateClientTypeCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(ClientTypeResolver.name)

      .get(ClientTypeResolver.name),
    })
  @Mutation(() => ClientTypeResponse<ClientType>)
  async createOrUpdateClientType(
    @Args("data", { type: () => CreateOrUpdateClientTypeDto })
    data: CreateOrUpdateClientTypeDto
  ): Promise<ClientTypeResponse<ClientType>> {
    if (data.id) {
      const existingClientType = await this.service.findById(data.id);
      if (existingClientType) {
        return this.commandBus.execute(
          new UpdateClientTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateClientTypeDto | UpdateClientTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateClientTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateClientTypeDto | UpdateClientTypeDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(ClientTypeResolver.name)

      .get(ClientTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteClientType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteClientTypeCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(ClientTypeResolver.name)

      .get(ClientTypeResolver.name),
    })
  // Queries
  @Query(() => ClientTypesResponse<ClientType>)
  async clienttypes(
    options?: FindManyOptions<ClientType>,
    paginationArgs?: PaginationArgs
  ): Promise<ClientTypesResponse<ClientType>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(ClientTypeResolver.name)

      .get(ClientTypeResolver.name),
    })
  @Query(() => ClientTypesResponse<ClientType>)
  async clienttype(
    @Args("id", { type: () => String }) id: string
  ): Promise<ClientTypeResponse<ClientType>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(ClientTypeResolver.name)

      .get(ClientTypeResolver.name),
    })
  @Query(() => ClientTypesResponse<ClientType>)
  async clienttypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ClientTypeValueInput }) value: ClientTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ClientTypesResponse<ClientType>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(ClientTypeResolver.name)

      .get(ClientTypeResolver.name),
    })
  @Query(() => ClientTypesResponse<ClientType>)
  async clienttypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ClientTypesResponse<ClientType>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(ClientTypeResolver.name)

      .get(ClientTypeResolver.name),
    })
  @Query(() => Number)
  async totalClientTypes(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(ClientTypeResolver.name)

      .get(ClientTypeResolver.name),
    })
  @Query(() => ClientTypesResponse<ClientType>)
  async searchClientTypes(
    @Args("where", { type: () => ClientTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ClientTypesResponse<ClientType>> {
    const clienttypes = await this.service.findAndCount(where);
    return clienttypes;
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(ClientTypeResolver.name)

      .get(ClientTypeResolver.name),
    })
  @Query(() => ClientTypeResponse<ClientType>, { nullable: true })
  async findOneClientType(
    @Args("where", { type: () => ClientTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ClientTypeResponse<ClientType>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(ClientTypeResolver.name)

      .get(ClientTypeResolver.name),
    })
  @Query(() => ClientTypeResponse<ClientType>)
  async findOneClientTypeOrFail(
    @Args("where", { type: () => ClientTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ClientTypeResponse<ClientType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

