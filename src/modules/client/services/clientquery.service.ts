import { Injectable } from "@nestjs/common";
import { ClientQueryRepository } from "../repositories/clientquery.repository";
import { Client } from "../entities/client.entity";
import { FindManyOptions } from "typeorm";

@Injectable()
export class ClientQueryService {
  // Constructor del servicio
  constructor(private readonly repository: ClientQueryRepository) {}

  /**
   * Encuentra todos los clientes.
   * @param options Opciones de búsqueda.
   * @returns Lista de clientes.
   */
  async findAll(options?: FindManyOptions<Client>): Promise<Client[]> {
    return this.repository.findAll(options);
  }

  /**
   * Encuentra un cliente por su ID.
   * @param id ID del cliente.
   * @returns Cliente encontrado o null.
   */
  async findById(id: string): Promise<Client | null> {
    return this.repository.findById(id);
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
    return this.repository.findByField(field, value, page, limit);
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
    return this.repository.findMany(ids, page, limit);
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
    return this.repository.findAndCount(where);
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
    return this.repository.findOne(where, relations);
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
    return this.repository.findManyAndCount(where, relations);
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
    const entity = await this.repository.findOne(where, relations);
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
    const entities = await this.repository.findManyOrFail(where, relations);
    if (!entities || entities.length === 0) {
      throw new Error("Entities not found");
    }
    return entities;
  }
}
