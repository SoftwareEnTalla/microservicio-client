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
  Get,
  Query,
  Param,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { ClientLoyaltyTierQueryService } from "../services/clientloyaltytierquery.service";
import { FindManyOptions } from "typeorm";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from "@nestjs/swagger";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { ClientLoyaltyTierResponse, ClientLoyaltyTiersResponse } from "../types/clientloyaltytier.types";
import { LoggerClient } from "src/common/logger/logger.client";
import { ClientLoyaltyTier } from "../entities/client-loyalty-tier.entity";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { OrderBy, valueOfOrderBy } from "src/common/types/common.types";
import { Helper } from "src/common/helpers/helpers";
import { ClientLoyaltyTierDto } from "../dtos/all-dto";

import { logger } from '@core/logs/logger';

@ApiTags("ClientLoyaltyTier Query")
@Controller("clientloyaltytiers/query")
export class ClientLoyaltyTierQueryController {
  #logger = new Logger(ClientLoyaltyTierQueryController.name);

  constructor(private readonly service: ClientLoyaltyTierQueryService) {}

  @Get("list")
  @ApiOperation({ summary: "Get all clientloyaltytier with optional pagination" })
  @ApiResponse({ status: 200, type: ClientLoyaltyTiersResponse })
  @ApiQuery({ name: "options", required: false, type: ClientLoyaltyTierDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierQueryService.name)
      .get(ClientLoyaltyTierQueryService.name),
  })
  async findAll(
    @Query("options") options?: FindManyOptions<ClientLoyaltyTier>    
  ): Promise<ClientLoyaltyTiersResponse<ClientLoyaltyTier>> {
    try {
     
      const clientloyaltytiers = await this.service.findAll(options);
      logger.info("Retrieving all clientloyaltytier");
      return clientloyaltytiers;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get clientloyaltytier by ID" })
  @ApiResponse({ status: 200, type: ClientLoyaltyTierResponse<ClientLoyaltyTier> })
  @ApiResponse({ status: 404, description: "ClientLoyaltyTier not found" })
  @ApiParam({ name: 'id', required: true, description: 'ID of the clientloyaltytier to retrieve', type: String })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierQueryService.name)
      .get(ClientLoyaltyTierQueryService.name),
  })
  async findById(@Param("id") id: string): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
    try {
      const clientloyaltytier = await this.service.findOne({ where: { id } });
      if (!clientloyaltytier) {
        throw new NotFoundException(
          "ClientLoyaltyTier no encontrado para el id solicitado"
        );
      }
      return clientloyaltytier;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("field/:field") // Asegúrate de que el endpoint esté definido correctamente
  @ApiOperation({ summary: "Find clientloyaltytier by specific field" })
  @ApiQuery({ name: "value", required: true, description: 'Value to search for', type: String }) // Documenta el parámetro de consulta
  @ApiParam({ name: 'field', required: true, description: 'Field to filter clientloyaltytier', type: String }) // Documenta el parámetro de la ruta
  @ApiResponse({ status: 200, type: ClientLoyaltyTiersResponse })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierQueryService.name)
      .get(ClientLoyaltyTierQueryService.name),
  })
  async findByField(
    @Param("field") field: string, // Obtiene el campo de la ruta
    @Query("value") value: string, // Obtiene el valor de la consulta
    @Query() paginationArgs?: PaginationArgs
  ): Promise<ClientLoyaltyTiersResponse<ClientLoyaltyTier>> {
    try {
      const entities = await this.service.findAndCount({
        where: { [field]: value },
        skip:
          ((paginationArgs ? paginationArgs.page : 1) - 1) *
          (paginationArgs ? paginationArgs.size : 25),
        take: paginationArgs ? paginationArgs.size : 25,
      });

      if (!entities) {
        throw new NotFoundException(
          "ClientLoyaltyTier no encontrados para la propiedad y valor especificado"
        );
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }


  @Get("pagination")
  @ApiOperation({ summary: "Find clientloyaltytiers with pagination" })
  @ApiResponse({ status: 200, type: ClientLoyaltyTiersResponse<ClientLoyaltyTier> })
  @ApiQuery({ name: "options", required: false, type: ClientLoyaltyTierDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierQueryService.name)
      .get(ClientLoyaltyTierQueryService.name),
  })
  async findWithPagination(
    @Query() options: FindManyOptions<ClientLoyaltyTier>,
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<ClientLoyaltyTiersResponse<ClientLoyaltyTier>> {
    try {
     const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        valueOfOrderBy(order || OrderBy.asc), // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findWithPagination(
        options,
        paginationArgs
      );
      if (!entities) {
        throw new NotFoundException("Entidades ClientLoyaltyTiers no encontradas.");
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("count")
  @ApiOperation({ summary: "Count all clientloyaltytiers" })
  @ApiResponse({ status: 200, type: Number })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierQueryService.name)
      .get(ClientLoyaltyTierQueryService.name),
  })
  async count(): Promise<number> {
    return this.service.count();
  }

  @Get("search")
  @ApiOperation({ summary: "Find and count clientloyaltytiers with conditions" })
  @ApiResponse({ status: 200, type: ClientLoyaltyTiersResponse<ClientLoyaltyTier> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierQueryService.name)
      .get(ClientLoyaltyTierQueryService.name),
  })
  async findAndCount(
    @Query() where: Record<string, any>={},
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<ClientLoyaltyTiersResponse<ClientLoyaltyTier>> {
    try {
      const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        valueOfOrderBy(order || OrderBy.asc), // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findAndCount({
        where: where,
        paginationArgs: paginationArgs,
      });

      if (!entities) {
        throw new NotFoundException(
          "Entidades ClientLoyaltyTiers no encontradas para el criterio especificado."
        );
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one")
  @ApiOperation({ summary: "Find one clientloyaltytier with conditions" })
  @ApiResponse({ status: 200, type: ClientLoyaltyTierResponse<ClientLoyaltyTier> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierQueryService.name)
      .get(ClientLoyaltyTierQueryService.name),
  })
  async findOne(
    @Query() where: Record<string, any>={}
  ): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier>> {
    try {
      const entity = await this.service.findOne({
        where: where,
      });

      if (!entity) {
        throw new NotFoundException("Entidad ClientLoyaltyTier no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one-or-fail")
  @ApiOperation({ summary: "Find one clientloyaltytier or return error" })
  @ApiResponse({ status: 200, type: ClientLoyaltyTierResponse<ClientLoyaltyTier> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierQueryService.name)
      .get(ClientLoyaltyTierQueryService.name),
  })
  async findOneOrFail(
    @Query() where: Record<string, any>={}
  ): Promise<ClientLoyaltyTierResponse<ClientLoyaltyTier> | Error> {
    try {
      const entity = await this.service.findOne({
        where: where,
      });

      if (!entity) {
        return new NotFoundException("Entidad ClientLoyaltyTier no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }
}


