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
import { ClientSegment } from "../entities/client-segment.entity";

//Definición de comandos
import {
  CreateClientSegmentCommand,
  UpdateClientSegmentCommand,
  DeleteClientSegmentCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ClientSegmentQueryService } from "../services/clientsegmentquery.service";


import { ClientSegmentResponse, ClientSegmentsResponse } from "../types/clientsegment.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateClientSegmentDto, 
CreateOrUpdateClientSegmentDto, 
ClientSegmentValueInput, 
ClientSegmentDto, 
CreateClientSegmentDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ClientSegment)
export class ClientSegmentResolver {

   //Constructor del resolver de ClientSegment
  constructor(
    private readonly service: ClientSegmentQueryService,
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
      .registerClient(ClientSegmentResolver.name)

      .get(ClientSegmentResolver.name),
    })
  // Mutaciones
  @Mutation(() => ClientSegmentResponse<ClientSegment>)
  async createClientSegment(
    @Args("input", { type: () => CreateClientSegmentDto }) input: CreateClientSegmentDto
  ): Promise<ClientSegmentResponse<ClientSegment>> {
    return this.commandBus.execute(new CreateClientSegmentCommand(input));
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
      .registerClient(ClientSegmentResolver.name)

      .get(ClientSegmentResolver.name),
    })
  @Mutation(() => ClientSegmentResponse<ClientSegment>)
  async updateClientSegment(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateClientSegmentDto
  ): Promise<ClientSegmentResponse<ClientSegment>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateClientSegmentCommand(payLoad, {
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
      .registerClient(ClientSegmentResolver.name)

      .get(ClientSegmentResolver.name),
    })
  @Mutation(() => ClientSegmentResponse<ClientSegment>)
  async createOrUpdateClientSegment(
    @Args("data", { type: () => CreateOrUpdateClientSegmentDto })
    data: CreateOrUpdateClientSegmentDto
  ): Promise<ClientSegmentResponse<ClientSegment>> {
    if (data.id) {
      const existingClientSegment = await this.service.findById(data.id);
      if (existingClientSegment) {
        return this.commandBus.execute(
          new UpdateClientSegmentCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateClientSegmentDto | UpdateClientSegmentDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateClientSegmentCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateClientSegmentDto | UpdateClientSegmentDto).createdBy ||
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
      .registerClient(ClientSegmentResolver.name)

      .get(ClientSegmentResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteClientSegment(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteClientSegmentCommand(id));
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
      .registerClient(ClientSegmentResolver.name)

      .get(ClientSegmentResolver.name),
    })
  // Queries
  @Query(() => ClientSegmentsResponse<ClientSegment>)
  async clientsegments(
    options?: FindManyOptions<ClientSegment>,
    paginationArgs?: PaginationArgs
  ): Promise<ClientSegmentsResponse<ClientSegment>> {
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
      .registerClient(ClientSegmentResolver.name)

      .get(ClientSegmentResolver.name),
    })
  @Query(() => ClientSegmentsResponse<ClientSegment>)
  async clientsegment(
    @Args("id", { type: () => String }) id: string
  ): Promise<ClientSegmentResponse<ClientSegment>> {
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
      .registerClient(ClientSegmentResolver.name)

      .get(ClientSegmentResolver.name),
    })
  @Query(() => ClientSegmentsResponse<ClientSegment>)
  async clientsegmentsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ClientSegmentValueInput }) value: ClientSegmentValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ClientSegmentsResponse<ClientSegment>> {
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
      .registerClient(ClientSegmentResolver.name)

      .get(ClientSegmentResolver.name),
    })
  @Query(() => ClientSegmentsResponse<ClientSegment>)
  async clientsegmentsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ClientSegmentsResponse<ClientSegment>> {
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
      .registerClient(ClientSegmentResolver.name)

      .get(ClientSegmentResolver.name),
    })
  @Query(() => Number)
  async totalClientSegments(): Promise<number> {
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
      .registerClient(ClientSegmentResolver.name)

      .get(ClientSegmentResolver.name),
    })
  @Query(() => ClientSegmentsResponse<ClientSegment>)
  async searchClientSegments(
    @Args("where", { type: () => ClientSegmentDto, nullable: false })
    where: Record<string, any>
  ): Promise<ClientSegmentsResponse<ClientSegment>> {
    const clientsegments = await this.service.findAndCount(where);
    return clientsegments;
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
      .registerClient(ClientSegmentResolver.name)

      .get(ClientSegmentResolver.name),
    })
  @Query(() => ClientSegmentResponse<ClientSegment>, { nullable: true })
  async findOneClientSegment(
    @Args("where", { type: () => ClientSegmentDto, nullable: false })
    where: Record<string, any>
  ): Promise<ClientSegmentResponse<ClientSegment>> {
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
      .registerClient(ClientSegmentResolver.name)

      .get(ClientSegmentResolver.name),
    })
  @Query(() => ClientSegmentResponse<ClientSegment>)
  async findOneClientSegmentOrFail(
    @Args("where", { type: () => ClientSegmentDto, nullable: false })
    where: Record<string, any>
  ): Promise<ClientSegmentResponse<ClientSegment> | Error> {
    return this.service.findOneOrFail(where);
  }
}

