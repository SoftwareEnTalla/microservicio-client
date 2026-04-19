/*
 * Copyright (c) 2026 SoftwarEnTalla
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


import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  ClientSegmentCreatedEvent,
  ClientSegmentUpdatedEvent,
  ClientSegmentDeletedEvent,

} from '../events/exporting.event';
import {
  SagaClientSegmentFailedEvent
} from '../events/clientsegment-failed.event';
import {
  CreateClientSegmentCommand,
  UpdateClientSegmentCommand,
  DeleteClientSegmentCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class ClientSegmentCrudSaga {
  private readonly logger = new Logger(ClientSegmentCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onClientSegmentCreated = ($events: Observable<ClientSegmentCreatedEvent>) => {
    return $events.pipe(
      ofType(ClientSegmentCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de ClientSegment: ${event.aggregateId}`);
        void this.handleClientSegmentCreated(event);
      }),
      map(() => null),
      map(event => {
        // Ejecutar comandos adicionales si es necesario
        return null;
      })
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onClientSegmentUpdated = ($events: Observable<ClientSegmentUpdatedEvent>) => {
    return $events.pipe(
      ofType(ClientSegmentUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de ClientSegment: ${event.aggregateId}`);
        void this.handleClientSegmentUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onClientSegmentDeleted = ($events: Observable<ClientSegmentDeletedEvent>) => {
    return $events.pipe(
      ofType(ClientSegmentDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de ClientSegment: ${event.aggregateId}`);
        void this.handleClientSegmentDeleted(event);
      }),
      map(() => null),
      map(event => {
        // Ejemplo: Ejecutar comando de compensación
        // return this.commandBus.execute(new CompensateDeleteCommand(...));
        return null;
      })
    );
  };



  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientSegmentCrudSaga.name)
      .get(ClientSegmentCrudSaga.name),
  })
  private async handleClientSegmentCreated(event: ClientSegmentCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ClientSegment Created completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }


  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientSegmentCrudSaga.name)
      .get(ClientSegmentCrudSaga.name),
  })
  private async handleClientSegmentUpdated(event: ClientSegmentUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ClientSegment Updated completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }


  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientSegmentCrudSaga.name)
      .get(ClientSegmentCrudSaga.name),
  })
  private async handleClientSegmentDeleted(event: ClientSegmentDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ClientSegment Deleted completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaClientSegmentFailedEvent( error,event));
  }
}
