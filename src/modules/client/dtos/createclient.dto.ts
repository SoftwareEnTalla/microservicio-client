import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsDate,
  IsOptional,
} from "class-validator";

export class CreateClientDto {
  // Propiedades específicas de la clase CreateClientDto en cuestión

  @ApiProperty({
    description: "El identificador del cliente",
    example:
      "Un UUID es una cadena de 36 caracteres que incluye letras y números, y se representa en el formato xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.",
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: "El nombre del cliente",
    example: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string = "";

  // Propiedades predeterminadas de la clase CreateClientDto según especificación del sistema
  @ApiProperty({
    description: "Fecha de creación de la instancia (Client).",
    example: true,
  })
  @IsDate()
  @IsNotEmpty()
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    description:
      "Fecha de modificación o actualización de la instancia (Client).",
    example: true,
  })
  @IsDate()
  @IsNotEmpty()
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    description: "Usuario que creó la instancia (Client).",
    example: true,
  })
  @IsString()
  @IsOptional()
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    description:
      'Determina el estado de la instancia (Client) en "Activo" i "Inactivo".',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean = false; // Por defecto, el objeto no está activo

  // Constructor
  constructor(partial: Partial<CreateClientDto>) {
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateClientDto>): CreateClientDto {
    const instance = new CreateClientDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}

export class ClientDto {
  // Propiedades específicas de la clase CreateClientDto en cuestión

  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name: string = "";

  // Propiedades predeterminadas de la clase CreateClientDto según especificación del sistema

  @IsDate()
  @IsNotEmpty()
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @IsDate()
  @IsNotEmpty()
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @IsString()
  @IsOptional()
  createdBy?: string; // Usuario que crea el objeto

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean = false; // Por defecto, el objeto no está activo

  // Constructor
  constructor(partial: Partial<CreateClientDto>) {
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateClientDto>): CreateClientDto {
    const instance = new CreateClientDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}
