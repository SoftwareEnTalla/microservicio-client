/*
 * Copyright (c) 2025 SoftwarEnTalla
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


import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity, TableInheritance, Column } from 'typeorm';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from "@nestjs/graphql";

@Entity('base_entity')  // 🔹 Necesario para que TypeORM la registre como entidad
@TableInheritance({ column: { type: "varchar", name: "type" } }) // 🔹 Permite herencia en entidades hijas
@ObjectType()
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
      type: String,
      nullable: false,
      description: "Identificador único de la instancia de Client",
  })
  @Field(() => String, { description: "Identificador único de la instancia de Client", nullable: false })
  id!: string;


  @ApiProperty({
      type: Date,
      nullable: false,
      description: "Fecha de creación de la instancia de Client",
  })
  @Field(() => Date, { description: "Fecha de creación de la instancia de Client", nullable: false })
  @CreateDateColumn({type: 'date',nullable: false,comment: 'Este es un campo del tiempo de creación de la instancia'})
  @IsDate()
  creationDate: Date = new Date(); // Fecha de creación por defecto

  @ApiProperty({
      type: Date,
      nullable: false,
      description: "Fecha de modificación de la instancia de Client",
  })
  @Field(() => Date, { description: "Fecha de modificación de la instancia de Client", nullable: false })
  @UpdateDateColumn({type: 'date',nullable: false,comment: 'Este es un campo del tiempo de modificación de la instancia'})
  @IsDate()
  modificationDate: Date = new Date(); // Fecha de modificación por defecto


  @ApiProperty({
      type: String,
      nullable: false,
      description: "Creador de la instancia de Client",
  })
  @Field(() => String, { description: "Creador de la instancia de Client", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false,comment: 'Este es un campo del creador de la instancia de Client' })
  @IsString()
  @IsOptional()
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
      type: Boolean,
      nullable: false,
      description: "Muestra si el objeto está activo o no",
  })
  @Field(() => Boolean, { description: "Muestra si el objeto está activo o no", nullable: false })
  @Column({ type: 'boolean', nullable: false,comment: 'Campo para muestrar si la instancia de Client está activa o no' })
  @IsBoolean()
  isActive: boolean = false; // Por defecto, el objeto no está activo

  //Sección de properties Getters and Setters

  get creator(): string {
    return this.createdBy||'system';
  }

  //Métodos públicos

  // Métodos abstractos para extender las clases hijas
  abstract create(data: any): Promise<BaseEntity> ;
  abstract update(data: any): Promise<BaseEntity>;
  abstract delete(id:string): Promise<BaseEntity>;

}
