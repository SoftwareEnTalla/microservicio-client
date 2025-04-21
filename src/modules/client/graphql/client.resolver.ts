import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  ClientDto,
  CreateClientDto,
  CreateOrUpdateClientDto,
  ClientValueInput,
} from "../dtos/createclient.dto";
import { Client } from "../entities/client.entity";
import {
  CreateClientCommand,
  UpdateClientCommand,
  DeleteClientCommand,
} from "../commands/exporting.command";
import { CommandBus } from "@nestjs/cqrs";
import { ClientQueryService } from "../services/clientquery.service";

import { UpdateClientDto } from "../dtos/updateclient.dto";
import { ClientResponse, ClientsResponse } from "../types/client.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Client)
export class ClientResolver {
  //Constructor del resolver de Client
  constructor(
    private readonly service: ClientQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: "resolver",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(ClientResolver.name)

      .get(ClientResolver.name),
  })
  // Mutaciones
  @Mutation(() => ClientResponse<Client>)
  async createClient(
    @Args("input", { type: () => CreateClientDto }) input: CreateClientDto
  ): Promise<ClientResponse<Client>> {
    return this.commandBus.execute(new CreateClientCommand(input));
  }

  @LogExecutionTime({
    layer: "resolver",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(ClientResolver.name)

      .get(ClientResolver.name),
  })
  @Mutation(() => ClientResponse<Client>)
  async updateClient(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateClientDto
  ): Promise<ClientResponse<Client>> {
    return this.commandBus.execute(new UpdateClientCommand(id, input));
  }

  @LogExecutionTime({
    layer: "resolver",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(ClientResolver.name)

      .get(ClientResolver.name),
  })
  @Mutation(() => ClientResponse<Client>)
  async createOrUpdateClient(
    @Args("data", { type: () => CreateOrUpdateClientDto })
    data: CreateOrUpdateClientDto
  ): Promise<ClientResponse<Client>> {
    if (data.id) {
      const existingClient = await this.service.findById(data.id);
      if (existingClient) {
        return this.commandBus.execute(
          new UpdateClientCommand(
            data.id,
            data.input as CreateClientDto | UpdateClientDto
          )
        );
      }
    }
    return this.commandBus.execute(new CreateClientCommand(data.input));
  }

  @LogExecutionTime({
    layer: "resolver",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(ClientResolver.name)

      .get(ClientResolver.name),
  })
  @Mutation(() => Boolean)
  async deleteClient(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteClientCommand(id));
  }

  @LogExecutionTime({
    layer: "resolver",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(ClientResolver.name)

      .get(ClientResolver.name),
  })
  // Queries
  @Query(() => ClientsResponse<Client>)
  async clients(
    options?: FindManyOptions<Client>,
    paginationArgs?: PaginationArgs
  ): Promise<ClientsResponse<Client>> {
    return this.service.findAll(options, paginationArgs);
  }

  @LogExecutionTime({
    layer: "resolver",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(ClientResolver.name)

      .get(ClientResolver.name),
  })
  @Query(() => ClientsResponse<Client>)
  async client(
    @Args("id", { type: () => String }) id: string
  ): Promise<ClientResponse<Client>> {
    return this.service.findById(id);
  }

  @LogExecutionTime({
    layer: "resolver",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(ClientResolver.name)

      .get(ClientResolver.name),
  })
  @Query(() => ClientsResponse<Client>)
  async clientsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ClientValueInput }) value: ClientValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ClientsResponse<Client>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }

  @LogExecutionTime({
    layer: "resolver",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(ClientResolver.name)

      .get(ClientResolver.name),
  })
  @Query(() => ClientsResponse<Client>)
  async clientsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ClientsResponse<Client>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }

  @LogExecutionTime({
    layer: "resolver",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(ClientResolver.name)

      .get(ClientResolver.name),
  })
  @Query(() => Number)
  async totalClients(): Promise<number> {
    return this.service.count();
  }

  @LogExecutionTime({
    layer: "resolver",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(ClientResolver.name)

      .get(ClientResolver.name),
  })
  @Query(() => ClientsResponse<Client>)
  async searchClients(
    @Args("where", { type: () => ClientDto, nullable: false })
    where: Record<string, any>
  ): Promise<ClientsResponse<Client>> {
    const clients = await this.service.findAndCount(where);
    return clients;
  }

  @LogExecutionTime({
    layer: "resolver",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(ClientResolver.name)

      .get(ClientResolver.name),
  })
  @Query(() => ClientResponse<Client>, { nullable: true })
  async findOneClient(
    @Args("where", { type: () => ClientDto, nullable: false })
    where: Record<string, any>
  ): Promise<ClientResponse<Client>> {
    return this.service.findOne(where);
  }

  @LogExecutionTime({
    layer: "resolver",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(ClientResolver.name)

      .get(ClientResolver.name),
  })
  @Query(() => ClientResponse<Client>)
  async findOneClientOrFail(
    @Args("where", { type: () => ClientDto, nullable: false })
    where: Record<string, any>
  ): Promise<ClientResponse<Client> | Error> {
    return this.service.findOneOrFail(where);
  }
}
