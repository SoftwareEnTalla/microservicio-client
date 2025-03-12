import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsWhere, In, Repository } from "typeorm";
import { BaseEntity } from "../entities/base.entity";
import { Client } from "../entities/client.entity";

@Injectable()
export class ClientQueryRepository {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>
  ) {
    this.validate();
  }
  private validate(): void {
    // Crear una instancia ficticia para validar la herencia
    const entityInstance = Object.create(Client.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${Client.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
      );
    }
  }
  async save(entity: Client): Promise<Client> {
    return this.repository.save(entity);
  }

  async findAll(options?: FindManyOptions<Client>): Promise<Client[]> {
    return this.repository.find(options);
  }

  async findById(id: string): Promise<Client | null> {
    const tmp: FindOptionsWhere<Client> = { id } as FindOptionsWhere<Client>; // Usa 'as FindOptionsWhere<Client>' para asegurar el tipo
    return this.repository.findOneBy(tmp);
  }
  async findByField(field: string, value: any): Promise<Client[] | null> {
    return this.repository.find({ [field]: value });
  }
  async findMany(ids: string[]): Promise<Client[] | null> {
    const where: FindOptionsWhere<Client> = { id: In(ids) as any }; // Asegúrate de que el tipo de `id` sea compatible
    return this.repository.findBy(where);
  }
  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
  async updateById(
    id: string,
    partialEntity: Partial<Client>
  ): Promise<Client | null> {
    const where: FindOptionsWhere<Client> = { id } as FindOptionsWhere<Client>;
    await this.repository.update(where, partialEntity as any); // Aserción de tipo aquí
    return this.repository.findOneBy(where);
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
    const entities = await this.repository.find({
      where: where,
      relations: relations,
    });
    if (!entities || entities.length === 0) {
      throw new Error("Entities not found");
    }
    return entities;
  }
}
