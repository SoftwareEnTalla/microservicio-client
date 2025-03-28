import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsDate,
  IsOptional,
} from "class-validator";

export class DeleteClientDto {
  // Propiedades específicas de la clase DeleteClientDto en cuestión

  @ApiProperty({
    description: "El identificador del cliente",
    example:
      "Un UUID es una cadena de 36 caracteres que incluye letras y números, y se representa en el formato xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.",
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: "Lista de identificadores de instancias a eliminar",
    example:
      "Se proporciona una lista de identificadores de clientes a eliminar",
  })
  @IsString()
  @IsOptional()
  ids?: string[];

  // Constructor privado para evitar instanciación directa
  private constructor(partial: Partial<DeleteClientDto>) {
    Object.assign(this, partial);
  }
}
