import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity, TableInheritance } from 'typeorm';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from "@nestjs/graphql";

@Entity('BaseEntity')  // 🔹 Necesario para que TypeORM la registre como entidad
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
  id: string="";


  @ApiProperty({
      type: Date,
      nullable: false,
      description: "Fecha de creación de la instancia de Client",
  })
  @Field(() => Date, { description: "Fecha de creación de la instancia de Client", nullable: false })
  @CreateDateColumn()
  @IsDate()
  creationDate: Date = new Date(); // Fecha de creación por defecto

  @ApiProperty({
      type: Date,
      nullable: false,
      description: "Fecha de modificación de la instancia de Client",
  })
  @Field(() => Date, { description: "Fecha de modificación de la instancia de Client", nullable: false })
  @UpdateDateColumn()
  @IsDate()
  modificationDate: Date = new Date(); // Fecha de modificación por defecto


  @ApiProperty({
      type: String,
      nullable: false,
      description: "Creador de la instancia de Client",
  })
  @Field(() => String, { description: "Creador de la instancia de Client", nullable: false })
  @IsString()
  @IsOptional()
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
      type: Boolean,
      nullable: false,
      description: "Muestra si el objeto está activo o no",
  })
  @Field(() => Boolean, { description: "Muestra si el objeto está activo o no", nullable: false })
  @IsBoolean()
  isActive: boolean = false; // Por defecto, el objeto no está activo


  // Métodos abstractos para extender las clases hijas
  abstract create(data: any): Promise<BaseEntity> ;
  abstract update(data: any): Promise<BaseEntity>;
  abstract delete(id:string): Promise<BaseEntity>;

}
