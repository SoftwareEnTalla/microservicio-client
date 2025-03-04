import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindManyOptions,
  FindOptionsWhere,
  In,
  Repository,
  DeepPartial,
} from "typeorm";
import { BaseEntity } from "../entities/base.entity";

@Injectable()
export class ClientQueryRepository<Type extends BaseEntity> {
  constructor(
    @InjectRepository(BaseEntity)
    private readonly repository: Repository<Type>
  ) {}

  async save(entity: Type): Promise<Type> {
    return this.repository.save(entity);
  }

  async findAll(options?: FindManyOptions<Type>): Promise<Type[]> {
    return this.repository.find(options);
  }

  async findById(id: string): Promise<Type | null> {
    const tmp: FindOptionsWhere<Type> = { id } as FindOptionsWhere<Type>; // Usa 'as FindOptionsWhere<Type>' para asegurar el tipo
    return this.repository.findOneBy(tmp);
  }
  async findByField(field: string, value: any): Promise<Type[] | null> {
    return this.repository.find({ [field]: value });
  }
  async findMany(ids: string[]): Promise<Type[] | null> {
    const where: FindOptionsWhere<Type> = { id: In(ids) as any }; // Asegúrate de que el tipo de `id` sea compatible
    return this.repository.findBy(where);
  }
  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
  async updateById(
    id: string,
    partialEntity: Partial<Type>
  ): Promise<Type | null> {
    const where: FindOptionsWhere<Type> = { id } as FindOptionsWhere<Type>;
    await this.repository.update(where, partialEntity as any); // Aserción de tipo aquí
    return this.repository.findOneBy(where);
  }
  async count(): Promise<number> {
    return this.repository.count();
  }
  async findAndCount(where?: Record<string, any>): Promise<[Type[], number]> {
    const [entities, count] = await this.repository.findAndCount({
      where: where,
    });
    return [entities, count];
  }
  async findOne(
    where?: Record<string, any>,
    relations?: string[]
  ): Promise<Type | null> {
    return this.repository.findOne({
      where: where,
      relations: relations,
    });
  }
  async findManyAndCount(
    where?: Record<string, any>,
    relations?: string[]
  ): Promise<[Type[], number]> {
    return this.repository.findAndCount({
      where: where,
      relations: relations,
    });
  }
  async findOneOrFail(
    where?: Record<string, any>,
    relations?: string[]
  ): Promise<Type> {
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
  ): Promise<Type[]> {
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
