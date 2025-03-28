import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindManyOptions,
  FindOptionsWhere,
  In,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
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

  /**
   * Encuentra todos los clientes.
   * @param options Opciones de búsqueda.
   * @returns Lista de clientes.
   */
  async findAll(options?: FindManyOptions<Client>): Promise<Client[]> {
    return this.repository.find(options);
  }

  /**
   * Encuentra un cliente por su ID.
   * @param id ID del cliente.
   * @returns Cliente encontrado o null.
   */
  async findById(id: string): Promise<Client | null> {
    const tmp: FindOptionsWhere<Client> = { id } as FindOptionsWhere<Client>;
    return this.repository.findOneBy(tmp);
  }

  /**
   * Encuentra clientes por un campo específico.
   * @param field Campo a buscar.
   * @param value Valor a buscar.
   * @param page Página de resultados.
   * @param limit Límites de resultados por página.
   * @returns Lista de clientes encontrados.
   */
  async findByField(
    field: string,
    value: any,
    page: number,
    limit: number
  ): Promise<Client[]> {
    const [clients] = await this.repository.findAndCount({
      where: { [field]: value },
      skip: (page - 1) * limit,
      take: limit,
    });
    return clients;
  }

  /**
   * Encuentra clientes por múltiples campos.
   * @param criteria Criterios de búsqueda.
   * @param page Página de resultados.
   * @param limit Límites de resultados por página.
   * @returns Lista de clientes encontrados.
   */
  async findByFields(
    criteria: Record<string, any>,
    page: number,
    limit: number
  ): Promise<Client[]> {
    const [clients] = await this.repository.findAndCount({
      where: criteria,
      skip: (page - 1) * limit,
      take: limit,
    });
    return clients;
  }

  /**
   * Encuentra clientes con paginación.
   * @param options Opciones de búsqueda.
   * @param page Página de resultados.
   * @param limit Límites de resultados por página.
   * @returns Lista de clientes encontrados.
   */
  async findWithPagination(
    options: FindManyOptions<Client>,
    page: number,
    limit: number
  ): Promise<Client[]> {
    const skip = (page - 1) * limit;
    return this.repository.find({ ...options, skip, take: limit });
  }

  /**
   * Encuentra clientes ordenados por un campo específico.
   * @param orderBy Objeto que define el orden.
   * @param page Página de resultados.
   * @param limit Límites de resultados por página.
   * @returns Lista de clientes ordenados.
   */
  async findAllOrdered(
    orderBy: { [key: string]: "ASC" | "DESC" },
    page: number,
    limit: number
  ): Promise<Client[]> {
    const [clients] = await this.repository.findAndCount({
      order: orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });
    return clients;
  }

  /**
   * Encuentra valores distintos de un campo.
   * @param field Campo a buscar.
   * @returns Lista de valores distintos.
   */
  async findDistinct(field: string): Promise<any[]> {
    return this.repository
      .createQueryBuilder()
      .select(field)
      .distinct(true)
      .getRawMany();
  }

  /**
   * Encuentra clientes con relaciones.
   * @param relations Relaciones a cargar.
   * @param page Página de resultados.
   * @param limit Límites de resultados por página.
   * @returns Lista de clientes encontrados.
   */
  async findWithRelations(
    relations: string[],
    page: number,
    limit: number
  ): Promise<Client[]> {
    const [clients] = await this.repository.findAndCount({
      relations,
      skip: (page - 1) * limit,
      take: limit,
    });
    return clients;
  }

  /**
   * Busca clientes por un término de consulta.
   * @param query Término de búsqueda.
   * @param page Página de resultados.
   * @param limit Límites de resultados por página.
   * @returns Lista de clientes encontrados.
   */
  async search(query: string, page: number, limit: number): Promise<Client[]> {
    const [clients] = await this.repository
      .createQueryBuilder("client")
      .where("client.name LIKE :query OR client.email LIKE :query", {
        query: `%${query}%`,
      })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return clients;
  }

  /**
   * Obtiene los últimos clientes creados dentro de un rango de días.
   * @param days Número de días.
   * @param page Página de resultados.
   * @param limit Límites de resultados por página.
   * @returns Lista de clientes encontrados.
   */
  async getLatestCreatedClients(
    days: number,
    page: number,
    limit: number
  ): Promise<Client[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const [clients] = await this.repository.findAndCount({
      where: { creationDate: MoreThanOrEqual(date) },
      order: { creationDate: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });
    return clients;
  }

  /**
   * Obtiene los últimos clientes actualizados dentro de un rango de días.
   * @param days Número de días.
   * @param page Página de resultados.
   * @param limit Límites de resultados por página.
   * @returns Lista de clientes encontrados.
   */
  async getLatestUpdatedClients(
    days: number,
    page: number,
    limit: number
  ): Promise<Client[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const [clients] = await this.repository.findAndCount({
      where: { modificationDate: MoreThanOrEqual(date) },
      order: { modificationDate: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });
    return clients;
  }

  /**
   * Encuentra múltiples clientes por sus IDs.
   * @param ids Lista de IDs.
   * @param page Página de resultados.
   * @param limit Límites de resultados por página.
   * @returns Lista de clientes encontrados.
   */
  async findMany(
    ids: string[],
    page: number,
    limit: number
  ): Promise<Client[] | null> {
    const where: FindOptionsWhere<Client> = { id: In(ids) as any };
    const [clients] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return clients;
  }

  /**
   * Cuenta el número total de clientes.
   * @returns Número total de clientes.
   */
  async count(): Promise<number> {
    return this.repository.count();
  }

  /**
   * Encuentra y cuenta clientes según criterios de búsqueda.
   * @param where Criterios de búsqueda.
   * @returns Lista de clientes y el conteo total.
   */
  async findAndCount(where?: Record<string, any>): Promise<[Client[], number]> {
    return this.repository.findAndCount({
      where: where,
    });
  }

  /**
   * Encuentra un cliente según criterios de búsqueda.
   * @param where Criterios de búsqueda.
   * @param relations Relaciones a cargar.
   * @returns Cliente encontrado o null.
   */
  async findOne(
    where?: Record<string, any>,
    relations?: string[]
  ): Promise<Client | null> {
    return this.repository.findOne({
      where: where,
      relations: relations,
    });
  }

  /**
   * Encuentra múltiples clientes y cuenta según criterios de búsqueda.
   * @param where Criterios de búsqueda.
   * @param relations Relaciones a cargar.
   * @returns Lista de clientes y el conteo total.
   */
  async findManyAndCount(
    where?: Record<string, any>,
    relations?: string[]
  ): Promise<[Client[], number]> {
    return this.repository.findAndCount({
      where: where,
      relations: relations,
    });
  }

  /**
   * Encuentra un cliente o lanza un error si no se encuentra.
   * @param where Criterios de búsqueda.
   * @param relations Relaciones a cargar.
   * @returns Cliente encontrado.
   */
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

  /**
   * Encuentra múltiples clientes o lanza un error si no se encuentran.
   * @param where Criterios de búsqueda.
   * @param relations Relaciones a cargar.
   * @returns Lista de clientes encontrados.
   */
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
