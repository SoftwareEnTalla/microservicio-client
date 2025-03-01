import { IQuery } from '@nestjs/cqrs';

export abstract class BaseQuery implements IQuery {
  constructor(public readonly metadata?: Record<string, any>) {}
}
