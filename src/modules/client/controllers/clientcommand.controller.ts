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
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { ClientCommandService } from "../services/clientcommand.service";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { Client } from "../entities/client.entity";
import { ClientResponse, ClientsResponse } from "../types/client.types";
import { CreateClientDto } from "../dtos/createclient.dto";
import { UpdateClientDto } from "../dtos/updateclient.dto";
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";

@ApiTags("Client Command")
@Controller("clients/command")
export class ClientCommandController {

  #logger = new Logger(ClientCommandController.name);

  //Constructor del controlador: ClientCommandController
  constructor(private readonly service: ClientCommandService) {}

  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientCommandController.name)
      .get(ClientCommandController.name),
  })
  @Post()
  @ApiOperation({ summary: "Create a new client" })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({ status: 201, type: ClientResponse<Client> })
  async create(
    @Body() createClientDtoInput: CreateClientDto
  ): Promise<ClientResponse<Client>> {
    try {
      const entity = await this.service.create(createClientDtoInput);

      if (!entity) {
        throw new NotFoundException("Client entity not found.");
      }

      return entity;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientCommandController.name)
      .get(ClientCommandController.name),
  })
  @Post("bulk")
  @ApiOperation({ summary: "Create multiple clients" })
  @ApiBody({ type: [CreateClientDto] })
  @ApiResponse({ status: 201, type: ClientsResponse<Client> })
  async bulkCreate(
    @Body() createClientDtosInput: CreateClientDto[]
  ): Promise<ClientsResponse<Client>> {
    try {
      const entities = await this.service.bulkCreate(createClientDtosInput);

      if (!entities) {
        throw new NotFoundException("Client entities not found.");
      }

      return entities;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientCommandController.name)
      .get(ClientCommandController.name),
  })
  @Put(":id")
  @ApiOperation({ summary: "Update an client" })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({ status: 200, type: ClientResponse<Client> })
  async update(
    @Param("id") id: string,
    @Body() partialEntity: UpdateClientDto
  ): Promise<ClientResponse<Client>> {
    try {
      const entity = await this.service.update(
        id,
        partialEntity
      );

      if (!entity) {
        throw new NotFoundException("Client entity not found.");
      }

      return entity;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientCommandController.name)
      .get(ClientCommandController.name),
  })
  @Put("bulk")
  @ApiOperation({ summary: "Update multiple clients" })
  @ApiBody({ type: [UpdateClientDto] })
  @ApiResponse({ status: 200, type: ClientsResponse<Client> })
  async bulkUpdate(
    @Body() partialEntities: UpdateClientDto[]
  ): Promise<ClientsResponse<Client>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("Client entities not found.");
      }

      return entities;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientCommandController.name)
      .get(ClientCommandController.name),
  })
  @Delete(":id")
  @ApiOperation({ summary: "Delete an client" })
  @ApiResponse({ status: 200, type: ClientResponse<Client> })
  async delete(@Param("id") id: string): Promise<ClientResponse<Client>> {
    try {
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("Client entity not found.");
      }

      return result;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(ClientCommandController.name)
      .get(ClientCommandController.name),
  })
  @Delete("bulk")
  @ApiOperation({ summary: "Delete multiple clients" })
  @ApiResponse({ status: 200, type: DeleteResult })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

