// Nest Modules
import { HttpStatus } from "@nestjs/common";
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  ValidationError,
} from "class-validator";

@ObjectType({ description: "Tipado para los correos electrónicos" })
export class Email {
  @Field(() => String, { description: "Correo electrónico", nullable: true })
  email: string = "";

  @Field(() => String, {
    description: "Etiqueta del correo electrónico",
    nullable: true,
  })
  label?: string = "";
}

@ObjectType({ description: "Tipado para los teléfonos" })
export class Phone {
  @Field(() => String, {
    description: "Código de área del teléfono",
    nullable: true,
  })
  stateCode: string = "";

  @Field(() => String, { description: "Número de teléfono", nullable: true })
  num: string = "";

  @Field(() => String, { description: "Etiqueta del teléfono", nullable: true })
  label?: string = "";
}

@InputType({ description: "Tipado para los correos electrónicos" })
export class EmailInput {
  @Field(() => String, { description: "Correo electrónico" })
  @IsEmail({})
  email: string = "";

  @Field(() => String, {
    description: "Etiqueta del correo electrónico",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  label?: string = "";
}

@InputType({ description: "Tipado para los teléfonos" })
export class PhoneInput {
  @Field(() => String, { description: "Código de área del teléfono" })
  @IsString()
  stateCode: string = "";

  @Field(() => String, { description: "Número de teléfono" })
  @IsString()
  num: string = "";

  @Field(() => String, { description: "Etiqueta del teléfono", nullable: true })
  @IsString()
  @IsOptional()
  label?: string = "";
}

export enum Gender {
  masculino = "masculino",
  femenino = "femenino",
  otro = "otro",
}

registerEnumType(Gender, {
  name: "Gender",
  description: "Enumeración de géneros válidos",
  valuesMap: {
    femenino: {
      description: "Género para las mujeres",
    },
    masculino: {
      description: "Género para los hombres",
    },
    otro: {
      description: "Opción para quien no desea definir su género",
    },
  },
});

export enum OrderBy {
  asd = "asc",
  desc = "desc",
}

export class PaginationParamsDto {
  @IsInt()
  @IsOptional()
  page: number = 0;

  @IsInt()
  @IsOptional()
  size: number = 50;

  @IsString()
  @IsOptional()
  sort: string = "";

  @IsString()
  @IsOptional()
  order: OrderBy = OrderBy.asd;

  @IsString()
  @IsOptional()
  search: string = "";

  @IsString()
  @IsOptional()
  status: string = "";

  @IsString()
  @IsOptional()
  role: string = "";
}

@ObjectType({ description: "Tipado para la paginación de las respuestas" })
export class Pagination {
  @Field(() => Number, {
    description: "Número de elementos en la página",
    nullable: true,
  })
  length: number = 0;

  @Field(() => Number, {
    description: "Número total de elementos",
    nullable: true,
  })
  size: number = 0;

  @Field(() => Number, {
    description: "Número de página actual",
    nullable: true,
  })
  page: number = 0;

  @Field(() => Number, {
    description: "Número de elementos por página",
    nullable: true,
  })
  lastPage: number = 0;

  @Field(() => Number, { description: "Índice de inicio", nullable: true })
  startIndex: number = 0;

  @Field(() => Number, { description: "Índice de fin", nullable: true })
  endIndex: number = 0;
}

@ObjectType({
  description: "Tipado para las respuestas de las apis de Graphql",
})
export class GQResponseBase {
  @Field(() => Boolean, { description: "Tipo de respuesta", nullable: true })
  ok: boolean = false;

  @Field(() => String, { description: "Mensaje de respuesta", nullable: true })
  message: string = "";

  @Field(() => Pagination, {
    description: "Paginado de respuesta",
    nullable: true,
  })
  pagination?: Pagination = new Pagination();
}

export class RestResponse<T> {
  ok: boolean = false;
  status: HttpStatus = HttpStatus.OK;
  message: string = "";
  token: string = "";
  pagination: Pagination = new Pagination();
  errors: ValidationError[] = [];
  data?: T;
}

export class CommonResponse<T> {
  ok: boolean = false;
  status: HttpStatus = HttpStatus.OK;
  message: string = "";
  pagination: Pagination = new Pagination();
  token: string = "";
  data?: T;
}
