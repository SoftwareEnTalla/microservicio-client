import { IsNotEmpty, IsString, IsBoolean, IsDate, IsOptional } from "class-validator";

export class UpdateClientDto {

  // Propiedades específicas de la clase UpdateClientDto en cuestión

   @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string = "";

  // Propiedades predeterminadas de la clase UpdateClientDto según especificación del sistema

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

  // Constructor privado para evitar instanciación directa
  private constructor(partial: Partial<UpdateClientDto>) {
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateClientDto>): UpdateClientDto {
    const instance = new UpdateClientDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}
