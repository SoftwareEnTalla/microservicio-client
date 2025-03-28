import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsDate,
  IsOptional,
} from "class-validator";

export class UpdateClientDto {
  // Propiedades específicas de la clase UpdateClientDto en cuestión

  @ApiProperty({
    description: "Lista de identificadores de instancias a eliminar",
    example:
      "Se proporciona una lista de identificadores de clientes a eliminar",
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

  // Propiedades predeterminadas de la clase UpdateClientDto según especificación del sistema

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

  // Constructor privado para evitar instanciación directa
  private constructor(partial: Partial<UpdateClientDto>) {
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateClientDto>): UpdateClientDto {
    const instance = new UpdateClientDto(data);
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}
