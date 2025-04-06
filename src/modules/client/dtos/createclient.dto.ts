import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsDate, IsOptional,IsObject, ValidateNested } from 'class-validator';
import { InputType, Field, ObjectType} from '@nestjs/graphql';  
import { UpdateClientDto } from './updateclient.dto';
import { isCreateOrUpdateClientDtoType } from '../decorators/client.decorators';


@InputType()
export class CreateClientDto {

  // Propiedades específicas de la clase CreateClientDto en cuestión
  
   
  @ApiProperty({
    description: "Identificador de instancia a crear",
    example: "Se proporciona un identificador de CreateClient a crear \(opcional\) ",
  })
  @IsString()
  @IsOptional()
  @Field(() => String,{ nullable: true })
  id?: string;

  @ApiProperty({
    type: String,
    description: "Nombre de instancia CreateClient",
    example: "Nombre de instancia CreateClient",
    nullable: false
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateClientDto según especificación del sistema

  @ApiProperty({
    type: Date,
    description: "Fecha de creación de la instancia (CreateClient).",
    example: "Fecha de creación de la instancia (CreateClient).",
    nullable: false
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: Date,
    description: "Fecha de actualización de la instancia (CreateClient).",
    example: "Fecha de actualización de la instancia (CreateClient).",
    nullable: false
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: String,
    description:
      "Usuario que realiza la creación de la instancia (CreateClient).",
    example: "Usuario que realiza la creación de la instancia (CreateClient).",
    nullable: true
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: Boolean,
    description: "Estado de activación de la instancia (CreateClient).",
    example: "Estado de activación de la instancia (CreateClient).",
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
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


        
        @InputType()
        export class ClientDto {
          // Propiedades específicas de la clase ClientDto en cuestión

          @ApiProperty({ type: String ,nullable: true, description: 'Identificador único de la instancia' })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          id?: string;

          @ApiProperty({ type: String ,nullable: false, description: 'Nombre de la instancia' })
          @IsString()
          @IsNotEmpty()
          @Field(() => String, { nullable: false })
          name: string = '';

          // Propiedades predeterminadas de la clase ClientDto según especificación del sistema

          @ApiProperty({ type: Date ,nullable: false, description: 'Fecha de creaciónde la instancia' })
          @IsDate()
          @IsNotEmpty()
          @Field(() => Date, { nullable: false })
          creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

          @ApiProperty({ type: Date ,nullable: false, description: 'Fecha de modificación de la instancia' })
          @IsDate()
          @IsNotEmpty()
          @Field(() => Date, { nullable: false })
          modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

          @ApiProperty({ type: String ,nullable: true, description: 'Creador de la instancia' })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          createdBy?: string; // Usuario que crea el objeto

          @ApiProperty({ type: Boolean ,nullable: false, description: 'Describe si la instancia está activa o no' })
          @IsBoolean()
          @IsNotEmpty()
          @Field(() => Boolean, { nullable: false })
          isActive: boolean = false; // Por defecto, el objeto no está activo

          // Constructor
          constructor(partial: Partial<ClientDto>) {
            Object.assign(this, partial);
          }

          // Método estático para construir la instancia
          static build(data: Partial<ClientDto>): ClientDto {
            const instance = new ClientDto(data);
            instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
            instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
            return instance;
          }
        }

        @ObjectType()
        export class ClientOutPutDto {
          // Propiedades específicas de la clase ClientDto en cuestión

          @ApiProperty({ type: String ,nullable: true, description: 'Identificador único de la instancia' })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          id?: string;

          @ApiProperty({ type: String ,nullable: false, description: 'Nombre de la instancia' })
          @IsString()
          @IsNotEmpty()
          @Field(() => String, { nullable: false })
          name: string = '';

          // Propiedades predeterminadas de la clase ClientDto según especificación del sistema
          @ApiProperty({ type: Date ,nullable: false, description: 'Fecha de creaciónde la instancia' })
          @IsDate()
          @IsNotEmpty()
          @Field(() => Date, { nullable: false })
          creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

          @ApiProperty({ type: Date ,nullable: false, description: 'Fecha de modificación de la instancia' })
          @IsDate()
          @IsNotEmpty()
          @Field(() => Date, { nullable: false })
          modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

          @ApiProperty({ type: String ,nullable: true, description: 'Creador de la instancia' })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          createdBy?: string; // Usuario que crea el objeto

          @ApiProperty({ type: Boolean ,nullable: false, description: 'Describe si la instancia está activa o no' })
          @IsBoolean()
          @IsNotEmpty()
          @Field(() => Boolean, { nullable: false })
          isActive: boolean = false; // Por defecto, el objeto no está activo

          // Constructor
          constructor(partial: Partial<ClientDto>) {
            Object.assign(this, partial);
          }

          // Método estático para construir la instancia
          static build(data: Partial<ClientDto>): ClientDto {
            const instance = new ClientDto(data);
            instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
            instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
            return instance;
          }
        }

        //Create or Update Dto

        @InputType()
        export class CreateOrUpdateClientDto {
          @ApiProperty({
            type: String,
            description: "Identificador de la instancia CreateClient",
            example: "Nombre de instancia CreateClient",
            nullable: true,
          })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          id?: string; // Si tiene ID, es una actualización

          @ApiProperty({
            type: ()=>CreateClientDto || UpdateClientDto,
            description: "Nombre de instancia CreateClient",
            example: "Nombre de instancia CreateClient",
            nullable: true
          })
          @IsOptional()
          @IsObject()
          @ValidateNested() // Asegúrate de validar los objetos anidados
          @isCreateOrUpdateClientDtoType({
            message:
              "input debe ser un objeto de tipo CreateClientDto o UpdateClientDto",
          }) // Usar class-transformer para la transformación de tipos
          @Field(() => CreateClientDto, { nullable: true }) // Asegúrate de que el campo sea nullable si es opcional
          input?: CreateClientDto | UpdateClientDto;
        }

        @InputType()
        export class ClientValueInput {
          @ApiProperty({ type: String ,nullable: false, description: 'Campo de filtro' })
          @Field({ nullable: false })
          fieldName: string = 'id';

          @ApiProperty({ type: ClientDto ,nullable: false, description: 'Valor del filtro' })
          @Field(() => ClientDto, { nullable: false })
          fieldValue: any; // Permite cualquier tipo
        }

        


