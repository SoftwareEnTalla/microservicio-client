import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, filter, map, tap } from 'rxjs';
import {
  ClientCreatedEvent,
  ClientUpdatedEvent,
  ClientDeletedEvent
} from '../events/exporting.event';
import {
  SagaClientFailedEvent
} from '../events/client-failed.event';
import {
  CreateClientCommand,
  UpdateClientCommand,
  DeleteClientCommand
} from '../commands/exporting.command';

@Injectable()
export class ClientCrudSaga {
  private readonly logger = new Logger(ClientCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onClientCreated = ($events: Observable<ClientCreatedEvent>) => {
    return $events.pipe(
      ofType(ClientCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Client: ${event.aggregateId}`);
        // Lógica post-creación (ej: enviar notificación)
      }),
      map(event => {
        // Ejecutar comandos adicionales si es necesario
        return null;
      })
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onClientUpdated = ($events: Observable<ClientUpdatedEvent>) => {
    return $events.pipe(
      ofType(ClientUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Client: ${event.aggregateId}`);
        // Lógica post-actualización (ej: actualizar caché)
      })
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onClientDeleted = ($events: Observable<ClientDeletedEvent>) => {
    return $events.pipe(
      ofType(ClientDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Client: ${event.aggregateId}`);
        // Lógica post-eliminación (ej: limpiar relaciones)
      }),
      map(event => {
        // Ejemplo: Ejecutar comando de compensación
        // return this.commandBus.execute(new CompensateDeleteCommand(...));
        return null;
      })
    );
  };

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaClientFailedEvent( error,event));
  }
}
