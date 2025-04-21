import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindManyOptions,
  FindOptionsWhere,
  In,
  MoreThanOrEqual,
  Repository,
  DeleteResult,
  UpdateResult,
} from "typeorm";
import { BaseEntity } from "../entities/base.entity";
import { Client } from "../entities/client.entity";
import { generateCacheKey } from "src/utils/functions";
import { Cacheable } from "../decorators/cache.decorator";
import { ClientRepository } from "./client.repository";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";

@Injectable()
export class ClientQueryRepository {
  //Constructor del repositorio de datos: ClientQueryRepository
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(Client.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${Client.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
      );
    }
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  async findAll(options?: FindManyOptions<Client>): Promise<Client[]> {
    return this.repository.find(options);
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  async findById(id: string): Promise<Client | null> {
    const tmp: FindOptionsWhere<Client> = { id } as FindOptionsWhere<Client>;
    return this.repository.findOneBy(tmp);
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  async findByField(
    field: string,
    value: any,
    page: number,
    limit: number
  ): Promise<Client[]> {
    const [entities] = await this.repository.findAndCount({
      where: { [field]: value },
      skip: (page - 1) * limit,
      take: limit,
    });
    return entities;
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  async findWithPagination(
    options: FindManyOptions<Client>,
    page: number,
    limit: number
  ): Promise<Client[]> {
    const skip = (page - 1) * limit;
    return this.repository.find({ ...options, skip, take: limit });
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  async count(): Promise<number> {
    return this.repository.count();
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  async findAndCount(where?: Record<string, any>): Promise<[Client[], number]> {
    return this.repository.findAndCount({
      where: where,
    });
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  async findOne(where?: Record<string, any>): Promise<Client | null> {
    return this.repository.findOne({
      where: where,
    });
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  async findOneOrFail(where?: Record<string, any>): Promise<Client> {
    const entity = await this.repository.findOne({
      where: where,
    });
    if (!entity) {
      throw new Error("Entity not found");
    }
    return entity;
  }
}
