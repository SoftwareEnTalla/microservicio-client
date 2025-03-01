import { AggregateRoot } from '@nestjs/cqrs';
import { BaseEntity } from '../entities/base.entity';

export class ClientAggregate extends AggregateRoot {
  private state: BaseEntity;

  constructor() {
    super();
  }

  // Métodos para modificar el estado
  public create(data: any): void {
    // Lógica de creación
  }

  public update(data: any): void {
    // Lógica de actualización
  }

  public delete(): void {
    // Lógica de eliminación
  }
}
