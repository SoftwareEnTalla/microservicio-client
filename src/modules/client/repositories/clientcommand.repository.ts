import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeleteResult,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from "typeorm";
import { BaseEntity } from "../entities/base.entity";
import { Client } from "../entities/client.entity";
import { ClientQueryRepository } from "./clientquery.repository";
import { UpdateClientDto } from "../dtos/updateclient.dto";

@Injectable()
export class ClientCommandRepository {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
    private readonly clientRepository: ClientQueryRepository
  ) {
    this.validate();
  }

  /**
   * Valida que la entidad Client extienda de BaseEntity.
   * @throws Error si Client no extiende de BaseEntity.
   */
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
   * Crea un nuevo cliente.
   * @param entity Cliente a crear.
   * @returns El cliente creado.
   */
  async create(entity: Client): Promise<Client> {
    return this.repository.save(entity);
  }

  /**
   * Crea múltiples clientes en una sola operación.
   * @param entities Lista de clientes a crear.
   * @returns Lista de clientes creados.
   */
  async bulkCreate(entities: Client[]): Promise<Client[]> {
    return this.repository.save(entities);
  }

  /**
   * Actualiza un cliente existente por su ID.
   * @param id ID del cliente a actualizar.
   * @param partialEntity Objeto que contiene los campos a actualizar.
   * @returns El cliente actualizado o null si no se encuentra.
   */
  async update(
    id: string,
    partialEntity: Partial<Client>
  ): Promise<Client | null> {
    let result: UpdateResult = await this.repository.update(id, partialEntity);
    return this.clientRepository.findById(id);
  }

  /**
   * Actualiza múltiples clientes en una sola operación.
   * @param entities Lista de clientes con sus campos a actualizar.
   * @returns Lista de clientes actualizados.
   */
  async bulkUpdate(entities: Partial<UpdateClientDto>[]): Promise<Client[]> {
    const updatedClients: Client[] = [];
    for (const entity of entities) {
      if (entity.id) {
        const updatedClient = await this.update(entity.id, entity);
        if (updatedClient) {
          updatedClients.push(updatedClient);
        }
      }
    }
    return updatedClients;
  }

  /**
   * Elimina un cliente por su ID.
   * @param id ID del cliente a eliminar.
   * @returns Resultado de la operación de eliminación.
   */
  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete({ id });
  }

  /**
   * Elimina múltiples clientes por sus IDs.
   * @param ids Lista de IDs de clientes a eliminar.
   * @returns Resultado de la operación de eliminación.
   */
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.delete(ids);
  }
}
