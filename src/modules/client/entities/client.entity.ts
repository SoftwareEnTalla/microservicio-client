import { Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { clientDto } from '../dtos/client.dto'; // Asegúrate de importar tu DTO

@Entity('client')
export class client extends BaseEntity {

  // Propiedades de client
  @IsString()
  @IsNotEmpty()
  private name: string = "";

  // Constructor de client
  constructor(name:string) {
    // Aquí inicializa las propiedades de client
    this.name = name;
  }
  
  // Getters y Setters

  get name(): string {
    return this.name;
  }

  set name(value: string) {
    this.name = value;
  }

  //Métodos o funciones de client

  //Implementación de Métodos abstractos de la clase padre
  async create(data: any): Promise<client> {
    // Convertir el objeto data a una instancia del DTO
    const clientDto = plainToClass(CreateclientDto, data);

    // Validar el DTO
    const errors = await validate(clientDto);
    if (errors.length > 0) {
      throw new Error('Validation failed creating client!'); // Manejo de errores de validación
    }
    return {...this,...data};
  }
  async update(data: any): Promise<client>{
    // Convertir el objeto data a una instancia del DTO
    const clientDto = plainToClass(CreateclientDto, data);

    // Validar el DTO
    const errors = await validate(clientDto);
    if (errors.length > 0) {
      throw new Error('Validation failed creating client!'); // Manejo de errores de validación
    }
    clientDto.modificationDate: Date = new Date(); // Fecha de modificación al momento de actualizar la instancia
    return {...this,...data};
  }
  async delete(): : Promise<client>{
    return {...this};
  }

}


