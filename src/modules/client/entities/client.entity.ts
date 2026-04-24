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

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, Check, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateClientDto, UpdateClientDto, DeleteClientDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { ClientType } from '../../client-type/entities/client-type.entity';
import { ClientSegment } from '../../client-segment/entities/client-segment.entity';
import { ClientLoyaltyTier } from '../../client-loyalty-tier/entities/client-loyalty-tier.entity';

@Index('idx_client_code', ['code'], { unique: true })
@Index('idx_client_email', ['email'], { unique: true })
@Check('chk_client_credit_limit_non_negative', '"creditLimit" >= 0')
@Unique('uq_client_code', ['code'])
@ChildEntity('client')
@ObjectType()
export class Client extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Client",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Client", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Client' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Client",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Client", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Client' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del cliente',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del cliente', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 50, unique: true, comment: 'Código del cliente' })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Correo comercial principal del cliente (autoritativo del client)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Correo comercial principal del cliente (autoritativo del client)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, unique: true, comment: 'Correo comercial principal del cliente (autoritativo del client)' })
  email?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Límite de crédito',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Límite de crédito', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 2, default: 0, comment: 'Límite de crédito' })
  creditLimit?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'FK soft a hrms:person canónica del cliente (nullable si aún no existe o hrms no disponible)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'FK soft a hrms:person canónica del cliente (nullable si aún no existe o hrms no disponible)', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'FK soft a hrms:person canónica del cliente (nullable si aún no existe o hrms no disponible)' })
  personId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre — mirror de hrms:person', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Nombre — mirror de hrms:person' })
  firstName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Apellido — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Apellido — mirror de hrms:person', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Apellido — mirror de hrms:person' })
  lastName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Tipo de documento — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Tipo de documento — mirror de hrms:person', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 255, comment: 'Tipo de documento — mirror de hrms:person' })
  documentType?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Número de documento — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Número de documento — mirror de hrms:person', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 60, comment: 'Número de documento — mirror de hrms:person' })
  documentNumber?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Teléfono — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Teléfono — mirror de hrms:person', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'Teléfono — mirror de hrms:person' })
  phone?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Email de la persona — mirror (distinto del email comercial autoritativo del client)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Email de la persona — mirror (distinto del email comercial autoritativo del client)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Email de la persona — mirror (distinto del email comercial autoritativo del client)' })
  personEmail?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de sincronización con el upstream hrms:person',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de sincronización con el upstream hrms:person', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'LOCAL_ONLY', comment: 'Estado de sincronización con el upstream hrms:person' })
  upstreamSyncStatus!: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Última sincronización exitosa con upstream',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Última sincronización exitosa con upstream', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Última sincronización exitosa con upstream' })
  upstreamSyncedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Hash SHA-256 del snapshot mirror recibido del upstream',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Hash SHA-256 del snapshot mirror recibido del upstream', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 64, comment: 'Hash SHA-256 del snapshot mirror recibido del upstream' })
  upstreamHash?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Último intento fallido de sincronización',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Último intento fallido de sincronización', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Último intento fallido de sincronización' })
  upstreamLastErrorAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Último intento (ok o ko) de sincronización',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Último intento (ok o ko) de sincronización', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Último intento (ok o ko) de sincronización' })
  upstreamLastAttemptAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Tipo de cliente',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Tipo de cliente', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Tipo de cliente' })
  clientTypeId?: string;

  @ApiProperty({
    type: () => ClientType,
    nullable: true,
    description: 'Relación con ClientType',
  })
  @Field(() => ClientType, { nullable: true })
  @ManyToOne(() => ClientType, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'clientTypeId' })
  clientType?: ClientType;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Segmento de cliente',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Segmento de cliente', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Segmento de cliente' })
  clientSegmentId?: string;

  @ApiProperty({
    type: () => ClientSegment,
    nullable: true,
    description: 'Relación con ClientSegment',
  })
  @Field(() => ClientSegment, { nullable: true })
  @ManyToOne(() => ClientSegment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'clientSegmentId' })
  clientSegment?: ClientSegment;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nivel de fidelidad del cliente',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Nivel de fidelidad del cliente', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Nivel de fidelidad del cliente' })
  clientLoyaltyTierId?: string;

  @ApiProperty({
    type: () => ClientLoyaltyTier,
    nullable: true,
    description: 'Relación con ClientLoyaltyTier',
  })
  @Field(() => ClientLoyaltyTier, { nullable: true })
  @ManyToOne(() => ClientLoyaltyTier, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'clientLoyaltyTierId' })
  clientLoyaltyTier?: ClientLoyaltyTier;

  protected executeDslLifecycle(): void {
    // Rule: credit-limit-must-be-non-negative
    // El límite de crédito debe ser mayor o igual a 0
    if (!((this.creditLimit === undefined || this.creditLimit === null || this.creditLimit >= 0))) {
      throw new Error('CLIENT_001: El límite de crédito no puede ser negativo');
    }

    // Rule: active-client-requires-email
    // Si el cliente se activa debe existir correo principal
    if (!(this.isActive === true && !(this.email === undefined || this.email === null || (typeof this.email === 'string' && String(this.email).trim() === '') || (Array.isArray(this.email) && this.email.length === 0) || (typeof this.email === 'object' && !Array.isArray(this.email) && Object.prototype.toString.call(this.email) === '[object Object]' && Object.keys(Object(this.email)).length === 0)))) {
      console.warn('CLIENT_002: Se recomienda definir correo principal para clientes activos');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'client';
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
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreateClientDto): Client;
  static fromDto(dto: UpdateClientDto): Client;
  static fromDto(dto: DeleteClientDto): Client;
  static fromDto(dto: any): Client {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Client, dto);
  }
}
