import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ClientCommandService } from "../services/clientcommand.service";
import { Client } from "../entities/client.entity";
import { DeleteResult } from "typeorm";
import { CreateClientDto } from "../dtos/createclient.dto";
import { UpdateClientDto } from "../dtos/updateclient.dto";
import { DeleteClientDto } from "../dtos/deleteclient.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("clients")
@Controller("clients")
export class ClientCommandController {
  constructor(private readonly clientCommandService: ClientCommandService) {}

  /**
   * Crea un nuevo cliente.
   * @param createClientDto Datos del cliente a crear.
   * @returns El cliente creado.
   */
  @Post()
  @ApiOperation({ summary: "Crea un nuevo cliente." })
  @ApiResponse({ status: 200, description: "Cliente creado", type: Client })
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    const client = new Client();
    client.setName = createClientDto.name; // Asigna el nombre del DTO
    client.creationDate = createClientDto.creationDate;
    client.modificationDate = createClientDto.modificationDate;
    client.createdBy = createClientDto.createdBy;
    client.isActive = createClientDto.isActive;

    return this.clientCommandService.create(client);
  }

  /**
   * Crea múltiples clientes en una sola operación.
   * @param createClientDtos Lista de datos de clientes a crear.
   * @returns Lista de clientes creados.
   */
  @Post("bulk")
  @ApiOperation({ summary: "Crea una colección de Client." })
  @ApiResponse({ status: 200, description: "Clientes creados", type: Client })
  async bulkCreate(
    @Body() createClientDtos: CreateClientDto[]
  ): Promise<Client[]> {
    const clients = createClientDtos.map((dto) => {
      const client = new Client();
      client.setName = dto.name; // Asigna el nombre del DTO
      client.creationDate = dto.creationDate;
      client.modificationDate = dto.modificationDate;
      client.createdBy = dto.createdBy;
      client.isActive = dto.isActive;
      return client;
    });
    return this.clientCommandService.bulkCreate(clients);
  }

  /**
   * Elimina un cliente por su ID.
   * @param id ID del cliente a eliminar.
   * @returns Resultado de la operación de eliminación.
   */
  @Delete(":id")
  @ApiOperation({
    summary: "Elimina una instancia de Client por el identificador.",
  })
  @ApiResponse({ status: 200, description: "Cliente eliminado", type: Client })
  async delete(@Param("id") id: string): Promise<DeleteResult> {
    return this.clientCommandService.delete(id);
  }

  /**
   * Elimina múltiples clientes por sus IDs.
   * @param deleteClientDtos Lista de datos de clientes a eliminar.
   * @returns Resultado de la operación de eliminación.
   */
  @Delete("bulk")
  @ApiOperation({ summary: "Elimina una colección de Client." })
  @ApiResponse({
    status: 200,
    description: "Clientes eliminados",
    type: Client,
  })
  async bulkDelete(
    @Body() deleteClientDtos: DeleteClientDto[]
  ): Promise<DeleteResult> {
    const ids: string[] = deleteClientDtos
      .map((dto) => dto.id)
      .filter((id): id is string => typeof id === "string" && id.trim() !== "");
    return this.clientCommandService.bulkDelete(ids);
  }

  /**
   * Actualiza un cliente existente por su ID.
   * @param id ID del cliente a actualizar.
   * @param updateClientDto Datos parciales del cliente a actualizar.
   * @returns El cliente actualizado o null si no se encuentra.
   */
  @Put(":id")
  @ApiOperation({ summary: "Actualiza un Client." })
  @ApiResponse({
    status: 200,
    description: "Cliente actualizado",
    type: Client,
  })
  async update(
    @Param("id") id: string,
    @Body() updateClientDto: UpdateClientDto
  ): Promise<Client | null> {
    const partialEntity: Partial<Client> = {
      modificationDate: new Date(), // Actualiza la fecha de modificación
      createdBy: updateClientDto.createdBy,
      isActive: updateClientDto.isActive,
    };
    partialEntity.setName = updateClientDto.name;
    return this.clientCommandService.update(id, partialEntity);
  }
  /**
   * Actualiza múltiples clientes existentes por sus IDs.
   * @param updateClientDtos Arreglo de objetos que contienen los IDs y los campos a actualizar.
   * @returns Lista de clientes actualizados o null si alguno no se encuentra.
   */
  @Put("bulk-update")
  @ApiOperation({ summary: "Actualiza múltiples Clients." })
  @ApiResponse({
    status: 200,
    description: "Clientes actualizados",
    type: [Client],
  })
  async bulkUpdate(
    @Body() updateClientDtos: UpdateClientDto[]
  ): Promise<Client[] | null> {
    // Asegúrate de que todos los DTOs tengan un ID
    const validEntities = updateClientDtos.filter(
      (entity) => entity.id && entity
    );

    if (validEntities.length !== updateClientDtos.length) {
      throw new BadRequestException(
        "Todos los DTOs deben incluir un ID y datos de actualización."
      );
    }

    const partialEntities = validEntities.map((entity) => ({
      ...entity,
      modificationDate: new Date(), // Actualiza la fecha de modificación
      id: entity.id, // Asocia el DTO con su ID correspondiente
    }));

    return await this.clientCommandService.bulkUpdate(partialEntities);
  }
}
