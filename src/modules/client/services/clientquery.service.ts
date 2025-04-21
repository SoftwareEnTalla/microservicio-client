import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { Client } from "../entities/client.entity";
import { BaseEntity } from "../entities/base.entity";
import { ClientQueryRepository } from "../repositories/clientquery.repository";
import { ClientResponse, ClientsResponse } from "../types/client.types";
import { Helper } from "src/common/helpers/helpers";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
//import { Cacheable } from "../decorators/cache.decorator";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";

@Injectable()
export class ClientQueryService {
  // Private properties
  readonly #logger = new Logger(ClientQueryService.name);
  private readonly loggerClient = new LoggerClient();

  constructor(private readonly repository: ClientQueryRepository) {
    this.validate();
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
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  private validate(): void {
    try {
      const entityInstance = Object.create(Client.prototype);
      if (!(entityInstance instanceof BaseEntity)) {
        let sms = `El tipo ${Client.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`;
        this.#logger.verbose(sms);
        throw new Error(sms);
      }
    } catch (error) {
      // Imprimir error
      this.#logger.error(error);
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
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findAll(
    options?: FindManyOptions<Client>,
    paginationArgs?: PaginationArgs
  ): Promise<ClientsResponse<Client>> {
    try {
      const clients = await this.repository.findAll(options);
      // Devolver respuesta
      this.#logger.verbose("sms");
      return {
        ok: true,
        message: "Listado de clients obtenido con éxito",
        data: clients,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          clients.length
        ),
        count: clients.length,
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
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findById(id: string): Promise<ClientResponse<Client>> {
    try {
      const client = await this.repository.findOne({
        where: { id },
        relations: [],
      });
      // Respuesta si el client no existe
      if (!client)
        throw new NotFoundException(
          "Client no encontrado para el id solicitado"
        );
      // Devolver client
      return {
        ok: true,
        message: "Client obtenido con éxito",
        data: client,
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
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findByField(
    field: string,
    value: any,
    paginationArgs?: PaginationArgs
  ): Promise<ClientsResponse<Client>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({
        where: { [field]: value },
        skip:
          ((paginationArgs ? paginationArgs.page : 1) - 1) *
          (paginationArgs ? paginationArgs.size : 25),
        take: paginationArgs ? paginationArgs.size : 25,
      });

      // Respuesta si el client no existe
      if (!entities)
        throw new NotFoundException(
          "Clients no encontrados para la propiedad y valor especificado"
        );
      // Devolver client
      return {
        ok: true,
        message: "Clients obtenidos con éxito.",
        data: entities,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          lenght
        ),
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
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findWithPagination(
    options: FindManyOptions<Client>,
    paginationArgs?: PaginationArgs
  ): Promise<ClientsResponse<Client>> {
    try {
      const entities = await this.repository.findWithPagination(
        options,
        paginationArgs ? paginationArgs.page : 1,
        paginationArgs ? paginationArgs.size : 25
      );

      // Respuesta si el client no existe
      if (!entities)
        throw new NotFoundException("Entidades Clients no encontradas.");
      // Devolver client
      return {
        ok: true,
        message: "Client obtenido con éxito.",
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
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async count(): Promise<number> {
    return this.repository.count();
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
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findAndCount(
    where?: Record<string, any>,
    paginationArgs?: PaginationArgs
  ): Promise<ClientsResponse<Client>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({
        where: where,
      });

      // Respuesta si el client no existe
      if (!entities)
        throw new NotFoundException(
          "Entidades Clients no encontradas para el criterio especificado."
        );
      // Devolver client
      return {
        ok: true,
        message: "Clients obtenidos con éxito.",
        data: entities,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          lenght
        ),
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
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findOne(where?: Record<string, any>): Promise<ClientResponse<Client>> {
    try {
      const entity = await this.repository.findOne({
        where: where,
      });

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
      .registerClient(ClientQueryService.name)
      .get(ClientQueryService.name),
  })
  async findOneOrFail(
    where?: Record<string, any>
  ): Promise<ClientResponse<Client> | Error> {
    try {
      const entity = await this.repository.findOne({
        where: where,
      });

      // Respuesta si el client no existe
      if (!entity)
        return new NotFoundException("Entidad Client no encontrada.");
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
}
