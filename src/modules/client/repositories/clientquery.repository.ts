import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

@Injectable()
export class ClientQueryRepository {
  constructor(
    @InjectRepository(BaseEntity)
    private readonly repository: Repository<BaseEntity>
  ) {}

  async save(entity: BaseEntity): Promise<BaseEntity> {
    return this.repository.save(entity);
  }

  async findAll(options?: FindManyOptions<BaseEntity>): Promise<BaseEntity[]> {
    return this.repository.find(options);
  }

  async findById(id: string): Promise<BaseEntity | null> {
    return this.repository.findOneBy({ id });
  }
  async findByField(field: string, value: any): Promise<BaseEntity[] | null> {
    return this.repository.find({ [field]: value });
  }
  async findMany(ids: string[]): Promise<BaseEntity[] | null> {
    return this.repository.findByIds(ids);
  }
  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
  async updateById(
    id: string,
    partialEntity: Partial<BaseEntity>
  ): Promise<BaseEntity | null> {
    await this.repository.update({ id }, partialEntity);
    return this.repository.findOneBy({ id });
  }
  async count(): Promise<number> {
    return this.repository.count();
  }
  async findAndCount(
    where?: Record<string, any>
  ): Promise<[BaseEntity[], number]> {
    const [entities, count] = await this.repository.findAndCount({
      where: where,
    });
    return [entities, count];
  }
  async findOne(
    where?: Record<string, any>,
    relations?: string[]
  ): Promise<BaseEntity | null> {
    return this.repository.findOne({
      where: where,
      relations: relations,
    });
  }
  async findManyAndCount(
    where?: Record<string, any>,
    relations?: string[]
  ): Promise<[BaseEntity[], number]> {
    return this.repository.findAndCount({
      where: where,
      relations: relations,
    });
  }
  async findOneOrFail(
    where?: Record<string, any>,
    relations?: string[]
  ): Promise<BaseEntity> {
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
  ): Promise<BaseEntity[]> {
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
