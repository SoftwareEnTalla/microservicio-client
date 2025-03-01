import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsBoolean, IsDate, IsOptional, IsString } from '@nestjs/class-validator';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  @IsDate()
  creationDate: Date = new Date(); // Fecha de creación por defecto

  @UpdateDateColumn()
  @IsDate()
  modificationDate: Date = new Date(); // Fecha de modificación por defecto

  @IsString()
  @IsOptional()
  createdBy?: string; // Usuario que crea el objeto

  @IsBoolean()
  isActive: boolean = false; // Por defecto, el objeto no está activo


  // Métodos abstractos para extender las clases hijas
  abstract create(data: any): Promise<BaseEntity> ;
  abstract update(data: any): Promise<BaseEntity>;
  abstract delete(id:string): Promise<BaseEntity>;

}
