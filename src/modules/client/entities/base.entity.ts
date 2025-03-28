import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  TableInheritance,
  Column,
} from "typeorm";
import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";

@Entity() // 🔹 Necesario para que TypeORM la registre como entidad
@TableInheritance({ column: { type: "varchar", name: "type" } }) // 🔹 Permite herencia en entidades hijas
export abstract class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  @IsDate()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  creationDate: Date = new Date(); // Fecha de creación por defecto

  @UpdateDateColumn()
  @IsDate()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto

  @IsString()
  @IsOptional()
  createdBy?: string; // Usuario que crea el objeto

  @IsBoolean()
  isActive: boolean = false; // Por defecto, el objeto no está activo

  // Métodos abstractos para extender las clases hijas
  abstract create(data: any): Promise<BaseEntity>;
  abstract update(data: any): Promise<BaseEntity>;
  abstract delete(id: string): Promise<BaseEntity>;
}
