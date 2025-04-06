import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { ClientQueryService } from "../services/clientquery.service";
import { FindManyOptions } from "typeorm";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from "@nestjs/swagger";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { ClientResponse, ClientsResponse } from "../types/client.types";
import { LoggerClient } from "src/common/logger/logger.client";
import { Client } from "../entities/client.entity";
import { Order, PaginationArgs } from "src/common/dto/args/pagination.args";
import { Helper } from "src/common/helpers/helpers";
import { ClientDto } from "../dtos/createclient.dto";

@ApiTags("Client Query")
@Controller("clients/query")
export class ClientQueryController {
  #logger = new Logger(ClientQueryController.name);

  constructor(private readonly service: ClientQueryService) {}

  @Get("list")
  @ApiOperation({ summary: "Get all client with optional pagination" })
  @ApiResponse({ status: 200, type: ClientsResponse })
  @ApiQuery({ name: "options", required: false, type: ClientDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: ()=>Order })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findAll(
    @Query("options") options?: FindManyOptions<Client>    
  ): Promise<ClientsResponse<Client>> {
    try {
     
      const clients = await this.service.findAll(options);
      this.#logger.verbose("Retrieving all client");
      return clients;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get client by ID" })
  @ApiResponse({ status: 200, type: ClientResponse<Client> })
  @ApiResponse({ status: 404, description: "Client not found" })
  @ApiParam({ name: 'id', required: true, description: 'ID of the client to retrieve', type: String })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findById(@Param("id") id: string): Promise<ClientResponse<Client>> {
    try {
      const client = await this.service.findOne({ where: { id } });
      if (!client) {
        throw new NotFoundException(
          "Client no encontrado para el id solicitado"
        );
      }
      return client;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("field/:field") // Asegúrate de que el endpoint esté definido correctamente
  @ApiOperation({ summary: "Find client by specific field" })
  @ApiQuery({ name: "value", required: true, description: 'Value to search for', type: String }) // Documenta el parámetro de consulta
  @ApiParam({ name: 'field', required: true, description: 'Field to filter client', type: String }) // Documenta el parámetro de la ruta
  @ApiResponse({ status: 200, type: ClientsResponse })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findByField(
    @Param("field") field: string, // Obtiene el campo de la ruta
    @Query("value") value: string, // Obtiene el valor de la consulta
    @Query() paginationArgs?: PaginationArgs
  ): Promise<ClientsResponse<Client>> {
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
          "Client no encontrados para la propiedad y valor especificado"
        );
      }
      return entities;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }


  @Get("pagination")
  @ApiOperation({ summary: "Find clients with pagination" })
  @ApiResponse({ status: 200, type: ClientsResponse<Client> })
  @ApiQuery({ name: "options", required: false, type: ClientDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: ()=>Order })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findWithPagination(
    @Query() options: FindManyOptions<Client>,
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: Order,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<ClientsResponse<Client>> {
    try {
     const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        order || Order.asc, // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findWithPagination(
        options,
        paginationArgs
      );
      if (!entities) {
        throw new NotFoundException("Entidades Clients no encontradas.");
      }
      return entities;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("count")
  @ApiOperation({ summary: "Count all clients" })
  @ApiResponse({ status: 200, type: Number })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async count(): Promise<number> {
    return this.service.count();
  }

  @Get("search")
  @ApiOperation({ summary: "Find and count clients with conditions" })
  @ApiResponse({ status: 200, type: ClientsResponse<Client> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: ()=>Order })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findAndCount(
    @Query() where: Record<string, any>={},
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: Order,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<ClientsResponse<Client>> {
    try {
      const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        order || Order.asc, // Asigna valor por defecto
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
          "Entidades Clients no encontradas para el criterio especificado."
        );
      }
      return entities;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one")
  @ApiOperation({ summary: "Find one client with conditions" })
  @ApiResponse({ status: 200, type: ClientResponse<Client> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findOne(
    @Query() where: Record<string, any>={}
  ): Promise<ClientResponse<Client>> {
    try {
      const entity = await this.service.findOne({
        where: where,
      });

      if (!entity) {
        throw new NotFoundException("Entidad Client no encontrada.");
      }
      return entity;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one-or-fail")
  @ApiOperation({ summary: "Find one client or return error" })
  @ApiResponse({ status: 200, type: ClientResponse<Client> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findOneOrFail(
    @Query() where: Record<string, any>={}
  ): Promise<ClientResponse<Client> | Error> {
    try {
      const entity = await this.service.findOne({
        where: where,
      });

      if (!entity) {
        return new NotFoundException("Entidad Client no encontrada.");
      }
      return entity;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }
}


