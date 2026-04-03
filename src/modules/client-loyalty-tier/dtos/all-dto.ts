/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */

import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';




@InputType()
export class BaseClientLoyaltyTierDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateClientLoyaltyTier',
    example: 'Nombre de instancia CreateClientLoyaltyTier',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateClientLoyaltyTierDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateClientLoyaltyTier).',
    example: 'Fecha de creación de la instancia (CreateClientLoyaltyTier).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateClientLoyaltyTier).',
    example: 'Fecha de actualización de la instancia (CreateClientLoyaltyTier).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateClientLoyaltyTier).',
    example:
      'Usuario que realiza la creación de la instancia (CreateClientLoyaltyTier).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateClientLoyaltyTier).',
    example: 'Estado de activación de la instancia (CreateClientLoyaltyTier).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del nivel de fidelidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del nivel de fidelidad', nullable: false })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre visible del nivel',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre visible del nivel', nullable: false })
  displayName!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Puntos mínimos para alcanzar el nivel',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Puntos mínimos para alcanzar el nivel', nullable: true })
  minPoints?: number = 0;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Beneficios asociados al nivel',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Beneficios asociados al nivel', nullable: true })
  benefits?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Configuración adicional',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Configuración adicional', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseClientLoyaltyTierDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ClientLoyaltyTierDto extends BaseClientLoyaltyTierDto {
  // Propiedades específicas de la clase ClientLoyaltyTierDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<ClientLoyaltyTierDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ClientLoyaltyTierDto>): ClientLoyaltyTierDto {
    const instance = new ClientLoyaltyTierDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ClientLoyaltyTierValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ClientLoyaltyTierDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ClientLoyaltyTierDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ClientLoyaltyTierOutPutDto extends BaseClientLoyaltyTierDto {
  // Propiedades específicas de la clase ClientLoyaltyTierOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<ClientLoyaltyTierOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ClientLoyaltyTierOutPutDto>): ClientLoyaltyTierOutPutDto {
    const instance = new ClientLoyaltyTierOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateClientLoyaltyTierDto extends BaseClientLoyaltyTierDto {
  // Propiedades específicas de la clase CreateClientLoyaltyTierDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateClientLoyaltyTier a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateClientLoyaltyTierDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateClientLoyaltyTierDto>): CreateClientLoyaltyTierDto {
    const instance = new CreateClientLoyaltyTierDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateClientLoyaltyTierDto {
  @ApiProperty({
    type: () => String,
    description: 'Identificador',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateClientLoyaltyTierDto,
    description: 'Instancia CreateClientLoyaltyTier o UpdateClientLoyaltyTier',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateClientLoyaltyTierDto, { nullable: true })
  input?: CreateClientLoyaltyTierDto | UpdateClientLoyaltyTierDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteClientLoyaltyTierDto {
  // Propiedades específicas de la clase DeleteClientLoyaltyTierDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteClientLoyaltyTier a eliminar',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = '';

  @ApiProperty({
    type: () => String,
    description: 'Lista de identificadores de instancias a eliminar',
    example:
      'Se proporciona una lista de identificadores de DeleteClientLoyaltyTier a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateClientLoyaltyTierDto extends BaseClientLoyaltyTierDto {
  // Propiedades específicas de la clase UpdateClientLoyaltyTierDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateClientLoyaltyTier a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateClientLoyaltyTierDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateClientLoyaltyTierDto>): UpdateClientLoyaltyTierDto {
    const instance = new UpdateClientLoyaltyTierDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

