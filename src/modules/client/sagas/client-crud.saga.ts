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
  ClientCreatedEvent,
  ClientUpdatedEvent,
  ClientDeletedEvent,
  ClientHighCreditLimitDetectedEvent,
} from '../events/exporting.event';
import {
  SagaClientFailedEvent
} from '../events/client-failed.event';
import {
  CreateClientCommand,
  UpdateClientCommand,
  DeleteClientCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

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
        void this.handleClientCreated(event);
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
  onClientUpdated = ($events: Observable<ClientUpdatedEvent>) => {
    return $events.pipe(
      ofType(ClientUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Client: ${event.aggregateId}`);
        void this.handleClientUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onClientDeleted = ($events: Observable<ClientDeletedEvent>) => {
    return $events.pipe(
      ofType(ClientDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Client: ${event.aggregateId}`);
        void this.handleClientDeleted(event);
      }),
      map(() => null),
      map(event => {
        // Ejemplo: Ejecutar comando de compensación
        // return this.commandBus.execute(new CompensateDeleteCommand(...));
        return null;
      })
    );
  };

  @Saga()
  onClientHighCreditLimitDetected = ($events: Observable<ClientHighCreditLimitDetectedEvent>) => {
    return $events.pipe(
      ofType(ClientHighCreditLimitDetectedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio ClientHighCreditLimitDetected: ${event.aggregateId}`);
      }),
      map(() => null)
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
      .registerClient(ClientCrudSaga.name)
      .get(ClientCrudSaga.name),
  })
  private async handleClientCreated(event: ClientCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Client Created completada: ${event.aggregateId}`);
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
      .registerClient(ClientCrudSaga.name)
      .get(ClientCrudSaga.name),
  })
  private async handleClientUpdated(event: ClientUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Client Updated completada: ${event.aggregateId}`);
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
      .registerClient(ClientCrudSaga.name)
      .get(ClientCrudSaga.name),
  })
  private async handleClientDeleted(event: ClientDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Client Deleted completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaClientFailedEvent( error,event));
  }
}
