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
import { Cacheable } from "../decorators/cache.decorator";
import { generateCacheKey } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";

@Injectable()
export class ClientRepository {
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

  //Funciones de Query-Repositories
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
  //Funciones de Command-Repositories
  @Cacheable({
    key: (args) => generateCacheKey<Client>("createClient", args[0], args[1]),
    ttl: 60,
  })
  async create(entity: Client): Promise<Client> {
    return this.repository.save(entity);
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
  @Cacheable({
    key: (args) =>
      generateCacheKey<Client[]>("createClients", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(entities: Client[]): Promise<Client[]> {
    return this.repository.save(entities);
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
  @Cacheable({
    key: (args) => generateCacheKey<Client>("updateClient", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: Partial<Client>
  ): Promise<Client | null> {
    let result: UpdateResult = await this.repository.update(id, partialEntity);
    return this.repository.findOneBy({ id: id });
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
  @Cacheable({
    key: (args) =>
      generateCacheKey<Client[]>("updateClients", args[0], args[1]),
    ttl: 60,
  })
  async bulkUpdate(entities: Partial<Client>[]): Promise<Client[]> {
    const updatedEntities: Client[] = [];
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
        }
      }
    }
    return updatedEntities;
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
  @Cacheable({
    key: (args) => generateCacheKey<string>("deleteClient", args[0]),
    ttl: 60,
  })
  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete({ id });
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
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteClients", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.delete(ids);
  }
}
