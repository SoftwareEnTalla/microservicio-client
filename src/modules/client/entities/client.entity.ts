import { Entity } from "typeorm";
import { BaseEntity } from "./base.entity";
import { IsNotEmpty, IsString, validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateClientDto } from "../dtos/createclient.dto";

@Entity("Client")
export class Client extends BaseEntity {
  // Propiedades de client
  @IsString()
  @IsNotEmpty()
  private name: string = "";

  // Constructor de client
  constructor() {
    super();
  }

  // Getters y Setters

  get getName(): string {
    return this.name;
  }

  set setName(value: string) {
    this.name = value;
  }

  //Métodos o funciones de client

  //Implementación de Métodos abstractos de la clase padre
  async create(data: any): Promise<Client> {
    // Convertir el objeto data a una instancia del DTO
    const clientDto = plainToClass(CreateClientDto, data);

    // Validar el DTO
    const errors = await validate(clientDto);
    if (errors.length > 0) {
      throw new Error("Validation failed creating client!"); // Manejo de errores de validación
    }
    return { ...this, ...data };
  }
  async update(data: any): Promise<Client> {
    // Convertir el objeto data a una instancia del DTO
    const clientDto = plainToClass(CreateClientDto, data);

    // Validar el DTO
    const errors = await validate(clientDto);
    if (errors.length > 0) {
      throw new Error("Validation failed creating client!"); // Manejo de errores de validación
    }
    clientDto.forEach((client) => {
      client.modificationDate = new Date(); // Fecha de modificación al momento de actualizar la instancia
    });
    return { ...this, ...data };
  }
  async delete(): Promise<Client> {
    return { ...this };
  }
}
