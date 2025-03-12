import { Injectable } from "@nestjs/common";
import { ClientQueryRepository } from "../repositories/clientquery.repository";
import { Client } from "../entities/client.entity";
import { FindManyOptions } from "typeorm";
@Injectable()
export class ClientQueryService {
  constructor(private readonly repository: ClientQueryRepository) {}

  // Implementar lógica de negocio aquí
  async save(entity: Client): Promise<Client> {
    return this.repository.save(entity);
  }

  async findAll(options?: FindManyOptions<Client>): Promise<Client[]> {
    return this.repository.findAll(options);
  }
  async findById(id: string): Promise<Client | null> {
    return this.repository.findById(id);
  }
  async findByField(field: string, value: any): Promise<Client[] | null> {
    return this.repository.findByField(field, value);
  }
  async findMany(ids: string[]): Promise<Client[] | null> {
    return this.repository.findMany(ids);
  }
  async deleteById(id: string): Promise<void> {
    await this.repository.deleteById(id);
  }
  async updateById(
    id: string,
    partialEntity: Partial<Client>
  ): Promise<Client | null> {
    await this.repository.updateById(id, partialEntity);
    return this.repository.findById(id);
  }
  async count(): Promise<number> {
    return this.repository.count();
  }
  async findAndCount(where?: Record<string, any>): Promise<[Client[], number]> {
    const [entities, count] = await this.repository.findAndCount({
      where: where,
    });
    return [entities, count];
  }
  async findOne(
    where?: Record<string, any>,
    relations?: string[]
  ): Promise<Client | null> {
    return this.repository.findOne({
      where: where,
      relations: relations,
    });
  }
  async findManyAndCount(
    where?: Record<string, any>,
    relations?: string[]
  ): Promise<[Client[], number]> {
    return this.repository.findAndCount({
      where: where,
      relations: relations,
    });
  }
  async findOneOrFail(
    where?: Record<string, any>,
    relations?: string[]
  ): Promise<Client> {
    const entity = await this.repository.findOne({
      where: where,
      relations: relations,
    });
    if (!entity) {
      throw new Error("Entity not found");
    }
    return entity;
  }
  async findManyOrFail(
    where?: Record<string, any>,
    relations?: string[]
  ): Promise<Client[]> {
    const entities = await this.repository.findAll({
      where: where,
      relations: relations,
    });
    if (!entities || entities.length === 0) {
      throw new Error("Entities not found");
    }
    return entities;
  }
}
