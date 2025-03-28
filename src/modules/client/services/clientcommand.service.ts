import { Injectable } from "@nestjs/common";
import { ClientCommandRepository } from "../repositories/clientcommand.repository";
import { Client } from "../entities/client.entity";
import { DeleteResult } from "typeorm";
import { UpdateClientDto } from "../dtos/updateclient.dto";

@Injectable()
export class ClientCommandService {
  constructor(private readonly repository: ClientCommandRepository) {}

  /**
   * Crea un nuevo cliente.
   * @param entity Cliente a crear.
   * @returns El cliente creado.
   */
  async create(entity: Client): Promise<Client> {
    return this.repository.create(entity);
  }

  /**
   * Crea múltiples clientes en una sola operación.
   * @param entity Lista de clientes a crear.
   * @returns Lista de clientes creados.
   */
  async bulkCreate(entity: Client[]): Promise<Client[]> {
    return this.repository.bulkCreate(entity);
  }

  /**
   * Elimina un cliente por su ID.
   * @param id ID del cliente a eliminar.
   * @returns Resultado de la operación de eliminación.
   */
  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  /**
   * Elimina múltiples clientes por sus IDs.
   * @param ids Lista de IDs de clientes a eliminar.
   * @returns Resultado de la operación de eliminación.
   */
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
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
    return await this.repository.update(id, partialEntity);
  }

  /**
   * Actualiza un cliente existente por su ID.
   * @param id ID del cliente a actualizar.
   * @param partialEntity Objeto que contiene los campos a actualizar.
   * @returns El cliente actualizado o null si no se encuentra.
   */
  async bulkUpdate(
    partialEntity: (Partial<UpdateClientDto> | undefined)[]
  ): Promise<Client[] | null> {
    // Asegúrate de que partialEntity no contenga undefined
    const validEntities = partialEntity.filter(
      (entity) => entity !== undefined
    );
    return await this.repository.bulkUpdate(validEntities);
  }
}
