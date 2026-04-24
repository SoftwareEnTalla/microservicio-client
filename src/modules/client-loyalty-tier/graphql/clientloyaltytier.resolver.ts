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
import { ClientLoyaltyTier } from "../entities/client-loyalty-tier.entity";

//Definición de comandos
import {
  CreateClientLoyaltyTierCommand,
  UpdateClientLoyaltyTierCommand,
  DeleteClientLoyaltyTierCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ClientLoyaltyTierQueryService } from "../services/clientloyaltytierquery.service";


import { ClientLoyaltyTierResponse, ClientLoyaltyTiersResponse } from "../types/clientloyaltytier.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateClientLoyaltyTierDto, 
CreateOrUpdateClientLoyaltyTierDto, 
ClientLoyaltyTierValueInput, 
ClientLoyaltyTierDto, 
CreateClientLoyaltyTierDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ClientLoyaltyTier)
export class ClientLoyaltyTierResolver {

   //Constructor del resolver de ClientLoyaltyTier
  constructor(
    private readonly service: ClientLoyaltyTierQueryService,
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
      .registerClient(ClientLoyaltyTierResolver.name)

      .get(ClientLoyaltyTierResolver.name),
    })
  // Mutaciones
  @Mutation(() => ClientLoyaltyTierResponse<ClientLoyaltyTier>)
  async createClientLoyaltyTier(
    @Args("input", { type: () => CreateClientLoyaltyTierDto }) input: CreateClientLoyaltyTierDto
  ): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
    return this.commandBus.execute(new CreateClientLoyaltyTierCommand(input));
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
      .registerClient(ClientLoyaltyTierResolver.name)

      .get(ClientLoyaltyTierResolver.name),
    })
  @Mutation(() => ClientLoyaltyTierResponse<ClientLoyaltyTier>)
  async updateClientLoyaltyTier(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateClientLoyaltyTierDto
  ): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateClientLoyaltyTierCommand(payLoad, {
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
      .registerClient(ClientLoyaltyTierResolver.name)

      .get(ClientLoyaltyTierResolver.name),
    })
  @Mutation(() => ClientLoyaltyTierResponse<ClientLoyaltyTier>)
  async createOrUpdateClientLoyaltyTier(
    @Args("data", { type: () => CreateOrUpdateClientLoyaltyTierDto })
    data: CreateOrUpdateClientLoyaltyTierDto
  ): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
    if (data.id) {
      const existingClientLoyaltyTier = await this.service.findById(data.id);
      if (existingClientLoyaltyTier) {
        return this.commandBus.execute(
          new UpdateClientLoyaltyTierCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateClientLoyaltyTierDto | UpdateClientLoyaltyTierDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateClientLoyaltyTierCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateClientLoyaltyTierDto | UpdateClientLoyaltyTierDto).createdBy ||
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
      .registerClient(ClientLoyaltyTierResolver.name)

      .get(ClientLoyaltyTierResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteClientLoyaltyTier(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteClientLoyaltyTierCommand(id));
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
      .registerClient(ClientLoyaltyTierResolver.name)

      .get(ClientLoyaltyTierResolver.name),
    })
  // Queries
  @Query(() => ClientLoyaltyTiersResponse<ClientLoyaltyTier>)
  async clientloyaltytiers(
    options?: FindManyOptions<ClientLoyaltyTier>,
    paginationArgs?: PaginationArgs
  ): Promise<ClientLoyaltyTiersResponse<ClientLoyaltyTier>> {
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
      .registerClient(ClientLoyaltyTierResolver.name)

      .get(ClientLoyaltyTierResolver.name),
    })
  @Query(() => ClientLoyaltyTiersResponse<ClientLoyaltyTier>)
  async clientloyaltytier(
    @Args("id", { type: () => String }) id: string
  ): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
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
      .registerClient(ClientLoyaltyTierResolver.name)

      .get(ClientLoyaltyTierResolver.name),
    })
  @Query(() => ClientLoyaltyTiersResponse<ClientLoyaltyTier>)
  async clientloyaltytiersByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ClientLoyaltyTierValueInput }) value: ClientLoyaltyTierValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ClientLoyaltyTiersResponse<ClientLoyaltyTier>> {
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
      .registerClient(ClientLoyaltyTierResolver.name)

      .get(ClientLoyaltyTierResolver.name),
    })
  @Query(() => ClientLoyaltyTiersResponse<ClientLoyaltyTier>)
  async clientloyaltytiersWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ClientLoyaltyTiersResponse<ClientLoyaltyTier>> {
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
      .registerClient(ClientLoyaltyTierResolver.name)

      .get(ClientLoyaltyTierResolver.name),
    })
  @Query(() => Number)
  async totalClientLoyaltyTiers(): Promise<number> {
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
      .registerClient(ClientLoyaltyTierResolver.name)

      .get(ClientLoyaltyTierResolver.name),
    })
  @Query(() => ClientLoyaltyTiersResponse<ClientLoyaltyTier>)
  async searchClientLoyaltyTiers(
    @Args("where", { type: () => ClientLoyaltyTierDto, nullable: false })
    where: Record<string, any>
  ): Promise<ClientLoyaltyTiersResponse<ClientLoyaltyTier>> {
    const clientloyaltytiers = await this.service.findAndCount(where);
    return clientloyaltytiers;
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
      .registerClient(ClientLoyaltyTierResolver.name)

      .get(ClientLoyaltyTierResolver.name),
    })
  @Query(() => ClientLoyaltyTierResponse<ClientLoyaltyTier>, { nullable: true })
  async findOneClientLoyaltyTier(
    @Args("where", { type: () => ClientLoyaltyTierDto, nullable: false })
    where: Record<string, any>
  ): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
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
      .registerClient(ClientLoyaltyTierResolver.name)

      .get(ClientLoyaltyTierResolver.name),
    })
  @Query(() => ClientLoyaltyTierResponse<ClientLoyaltyTier>)
  async findOneClientLoyaltyTierOrFail(
    @Args("where", { type: () => ClientLoyaltyTierDto, nullable: false })
    where: Record<string, any>
  ): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier> | Error> {
    return this.service.findOneOrFail(where);
  }
}

