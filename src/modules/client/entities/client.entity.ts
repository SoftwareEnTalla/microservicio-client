import { Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateClientDto } from '../dtos/createclient.dto';
import { UpdateClientDto } from '../dtos/updateclient.dto';
import { DeleteClientDto } from '../dtos/deleteclient.dto';
import { IsNotEmpty, IsString, validate } from 'class-validator';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity('Client')
export class Client extends BaseEntity {

  // Propiedades de Client
  @ApiProperty({
      type: String,
      nullable: false,
      description: "Nombre de la instancia de Client",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Client", nullable: false })
  private name: string = "";

  // Constructor de Client
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

  //Métodos o funciones de Client

  static fromDto(dto:CreateClientDto|UpdateClientDto|DeleteClientDto):Client{
       return plainToClass(Client, dto);
  }

  //Implementación de Métodos abstractos de la clase padre
  async create(data: any): Promise<Client> {

    // Verifica si data es un array y toma el primer objeto si es necesario
    const singleData = Array.isArray(data) ? data[0] : data;  // Si es un array, tomamos el primer objeto

    // Convertir el objeto data a una instancia del DTO
    const clientDto = plainToInstance(CreateClientDto, data as CreateClientDto);

    // Validar el DTO
    const errors = await validate(clientDto);
    if (errors.length > 0) {
      throw new Error('Validation failed creating client!'); // Manejo de errores de validación
    }
    // Asignar la fecha de modificación
    clientDto.modificationDate = new Date();
    return {...this,...clientDto};
  }
  async update(data: any): Promise<Client>{

    // Verifica si data es un array y toma el primer objeto si es necesario
    const singleData = Array.isArray(data) ? data[0] : data;  // Si es un array, tomamos el primer objeto


    // Convertir el objeto data a una instancia del DTO
    const clientDto = plainToInstance(CreateClientDto, singleData as CreateClientDto);


    // Validar el DTO
    const errors = await validate(clientDto);
    if (errors.length > 0) {
      throw new Error('Validation failed creating client!'); // Manejo de errores de validación
    }
    // Asignar la fecha de modificación
    clientDto.modificationDate = new Date();
    return {...this,...clientDto};
  }
  async delete():  Promise<Client>{
    return {...this};
  }

}
