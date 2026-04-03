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

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateClientSegmentDto, UpdateClientSegmentDto, DeleteClientSegmentDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { plainToInstance } from 'class-transformer';


@ChildEntity('clientsegment')
@ObjectType()
export class ClientSegment extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de ClientSegment",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de ClientSegment", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia ClientSegment' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de ClientSegment",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de ClientSegment", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia ClientSegment' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del segmento de cliente',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del segmento de cliente', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 30, unique: true, comment: 'Código del segmento de cliente' })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre visible del segmento',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre visible del segmento', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'Nombre visible del segmento' })
  displayName!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Configuración adicional del segmento',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Configuración adicional del segmento', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Configuración adicional del segmento' })
  metadata?: Record<string, any> = {};

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'clientsegment';
  }

  // Getters y Setters
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }
  get getDescription(): string {
    return this.description;
  }

  // Métodos abstractos implementados
  async create(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreateClientSegmentDto): ClientSegment;
  static fromDto(dto: UpdateClientSegmentDto): ClientSegment;
  static fromDto(dto: DeleteClientSegmentDto): ClientSegment;
  static fromDto(dto: any): ClientSegment {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(ClientSegment, dto);
  }
}
