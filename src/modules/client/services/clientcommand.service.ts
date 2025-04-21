import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { Client } from "../entities/client.entity";
import { CreateClientDto } from "../dtos/createclient.dto";
import { UpdateClientDto } from "../dtos/updateclient.dto";
import { DeleteClientDto } from "../dtos/deleteclient.dto";
import { generateCacheKey } from "src/utils/functions";
import { ClientCommandRepository } from "../repositories/clientcommand.repository";
import { ClientQueryRepository } from "../repositories/clientquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ClientResponse, ClientsResponse } from "../types/client.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";

@Injectable()
export class ClientCommandService {
  // Private properties
  readonly #logger = new Logger(ClientCommandService.name);
  //Constructo del servicio ClientCommandService
  constructor(
    private readonly repository: ClientCommandRepository,
    private readonly queryRepository: ClientQueryRepository
  ) {
    //Inicialice aquí propiedades o atributos
  }

  @LogExecutionTime({
    layer: "service",
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
      const entity = await this.repository.create(
        Client.fromDto(createClientDtoInput)
      );

      // Respuesta si el client no existe
      if (!entity) throw new NotFoundException("Entidad Client no encontrada.");
      // Devolver client
      return {
        ok: true,
        message: "Client obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      this.#logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
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
      .registerClient(ClientCommandService.name)
      .get(ClientCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<Client>("createClients", args[0], args[1]),
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
      this.#logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
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
      this.#logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
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
      .registerClient(ClientCommandService.name)
      .get(ClientCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<UpdateClientDto>("updateClients", args[0]),
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
      this.#logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
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
      this.#logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
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
