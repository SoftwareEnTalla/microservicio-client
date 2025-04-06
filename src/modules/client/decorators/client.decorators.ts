import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { CreateClientDto } from "../dtos/createclient.dto";
import { UpdateClientDto } from "../dtos/updateclient.dto";
import { createUnionType } from "@nestjs/graphql";

@ValidatorConstraint({ name: "isCreateOrUpdateClientDtoType", async: false })
export class IsClientTypeConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    // Verifica si el valor es un objeto y tiene la estructura esperada
    return (
      value instanceof CreateClientDto || value instanceof UpdateClientDto
    );
  }

  defaultMessage() {
    return "El valor debe ser un objeto de tipo CreateClientDto o UpdateClientDto";
  }
}

export function isCreateOrUpdateClientDtoType(
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsClientTypeConstraint,
    });
  };
}

// Crear un tipo de unión para GraphQL
export const ClientUnion = createUnionType({
  name: 'ClientUnion',
  types: () => [CreateClientDto, UpdateClientDto] as const,
});

