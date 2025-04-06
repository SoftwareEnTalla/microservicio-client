import { IQuery } from '@nestjs/cqrs';

export abstract class BaseQuery implements IQuery {
  //Constructor de BaseQuery
  constructor(public readonly metadata?: Record<string, any>) {
    //Aquí coloca implementación escencial no más de BaseQuery
  }
}
