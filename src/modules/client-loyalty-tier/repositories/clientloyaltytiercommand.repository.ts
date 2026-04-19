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
import { Injectable, NotFoundException, Optional, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  UpdateResult,
} from 'typeorm';


import { BaseEntity } from '../entities/base.entity';
import { ClientLoyaltyTier } from '../entities/client-loyalty-tier.entity';
import { ClientLoyaltyTierQueryRepository } from './clientloyaltytierquery.repository';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {ClientLoyaltyTierRepository} from './clientloyaltytier.repository';

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

//Events and EventHandlers
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ClientLoyaltyTierCreatedEvent } from '../events/clientloyaltytiercreated.event';
import { ClientLoyaltyTierUpdatedEvent } from '../events/clientloyaltytierupdated.event';
import { ClientLoyaltyTierDeletedEvent } from '../events/clientloyaltytierdeleted.event';


//Enfoque Event Sourcing
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { EventStoreService } from '../shared/event-store/event-store.service';
import { KafkaEventPublisher } from '../shared/adapters/kafka-event-publisher';
import { BaseEvent } from '../events/base.event';

//Event Sourcing Config
import { EventSourcingHelper } from '../shared/decorators/event-sourcing.helper';
import { EventSourcingConfigOptions } from '../shared/decorators/event-sourcing.decorator';


@EventsHandler(ClientLoyaltyTierCreatedEvent, ClientLoyaltyTierUpdatedEvent, ClientLoyaltyTierDeletedEvent)
@Injectable()
export class ClientLoyaltyTierCommandRepository implements IEventHandler<BaseEvent>{

  //Constructor del repositorio de datos: ClientLoyaltyTierCommandRepository
  constructor(
    @InjectRepository(ClientLoyaltyTier)
    private readonly repository: Repository<ClientLoyaltyTier>,
    private readonly clientloyaltytierRepository: ClientLoyaltyTierQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private readonly eventBus: EventBus,
    @Optional() @Inject('EVENT_SOURCING_CONFIG') 
    private readonly eventSourcingConfig: EventSourcingConfigOptions = EventSourcingHelper.getDefaultConfig()
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierRepository.name)
      .get(ClientLoyaltyTierRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(ClientLoyaltyTier.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${ClientLoyaltyTier.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
      );
    }
  }

  // Helper para determinar si usar Event Sourcing
  private shouldPublishEvent(): boolean {
    return EventSourcingHelper.shouldPublishEvents(this.eventSourcingConfig);
  }

  private shouldUseProjections(): boolean {
    return EventSourcingHelper.shouldUseProjections(this.eventSourcingConfig);
  }


  // ----------------------------
  // MÉTODOS DE PROYECCIÓN (Event Handlers) para enfoque Event Sourcing
  // ----------------------------

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierRepository.name)
      .get(ClientLoyaltyTierRepository.name),
  })
  async handle(event: any) {
    // Solo manejar eventos si las proyecciones están habilitadas
    if (!this.shouldUseProjections()) {
      logger.debug('Projections are disabled, skipping event handling');
      return false;
    }
    
    logger.info('Ready to handle ClientLoyaltyTier event on repository:', event);
    switch (event.constructor.name) {
      case 'ClientLoyaltyTierCreatedEvent':
        return await this.onClientLoyaltyTierCreated(event);
      case 'ClientLoyaltyTierUpdatedEvent':
        return await this.onClientLoyaltyTierUpdated(event);
      case 'ClientLoyaltyTierDeletedEvent':
        return await this.onClientLoyaltyTierDeleted(event);

    }
    return false;
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierRepository.name)
      .get(ClientLoyaltyTierRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<ClientLoyaltyTier>('createClientLoyaltyTier', args[0], args[1]),
    ttl: 60,
  })
  private async onClientLoyaltyTierCreated(event: ClientLoyaltyTierCreatedEvent) {
    logger.info('Ready to handle onClientLoyaltyTierCreated event on repository:', event);
    const entity = new ClientLoyaltyTier();
    entity.id = event.aggregateId;
    Object.assign(entity, event.payload.instance);
    // Asegurar que el tipo discriminador esté establecido
    if (!entity.type) {
      entity.type = 'clientloyaltytier';
    }
    logger.info('Ready to save entity from event\'s payload:', entity);
    return await this.repository.save(entity);
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierRepository.name)
      .get(ClientLoyaltyTierRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<ClientLoyaltyTier>('updateClientLoyaltyTier', args[0], args[1]),
    ttl: 60,
  })
  private async onClientLoyaltyTierUpdated(event: ClientLoyaltyTierUpdatedEvent) {
    logger.info('Ready to handle onClientLoyaltyTierUpdated event on repository:', event);
    return await this.repository.update(
      event.aggregateId,
      event.payload.instance
    );
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierRepository.name)
      .get(ClientLoyaltyTierRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<ClientLoyaltyTier>('deleteClientLoyaltyTier', args[0], args[1]),
    ttl: 60,
  })
  private async onClientLoyaltyTierDeleted(event: ClientLoyaltyTierDeletedEvent) {
    logger.info('Ready to handle onClientLoyaltyTierDeleted event on repository:', event);
    return await this.repository.delete(event.aggregateId);
  }



  // ----------------------------
  // MÉTODOS CRUD TRADICIONALES (Compatibilidad)
  // ----------------------------
 
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierRepository.name)
      .get(ClientLoyaltyTierRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<ClientLoyaltyTier>('createClientLoyaltyTier',args[0], args[1]), ttl: 60 })
  async create(entity: ClientLoyaltyTier): Promise<ClientLoyaltyTier> {
    logger.info('Ready to create ClientLoyaltyTier on repository:', entity);
    
    // Asegurar que el tipo discriminador esté establecido antes de guardar
    if (!entity.type) {
      entity.type = 'clientloyaltytier';
    }
    
    const result = await this.repository.save(entity);
    logger.info('New instance of ClientLoyaltyTier was created with id:'+ result.id+' on repository:', result);
    
    // Publicar evento solo si Event Sourcing está habilitado
    if (this.shouldPublishEvent()) {
      const __dualEvt1 = new ClientLoyaltyTierCreatedEvent(result.id, {
        instance: result,
        metadata: {
          initiatedBy: result.creator,
          correlationId: result.id,
        },
      });
      this.eventBus.publish(__dualEvt1);
      this.eventPublisher.publish(__dualEvt1);
    }
    return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierRepository.name)
      .get(ClientLoyaltyTierRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<ClientLoyaltyTier[]>('createClientLoyaltyTiers',args[0], args[1]), ttl: 60 })
  async bulkCreate(entities: ClientLoyaltyTier[]): Promise<ClientLoyaltyTier[]> {
    logger.info('Ready to create ClientLoyaltyTier on repository:', entities);
    
    // Asegurar que el tipo discriminador esté establecido para todas las entidades
    entities.forEach(entity => {
      if (!entity.type) {
        entity.type = 'clientloyaltytier';
      }
    });
    
    const result = await this.repository.save(entities);
    logger.info('New '+entities.length+' instances of ClientLoyaltyTier was created on repository:', result);
    
    // Publicar eventos solo si Event Sourcing está habilitado
    if (this.shouldPublishEvent()) {
      const __dualEvts2 = result.map((el)=>new ClientLoyaltyTierCreatedEvent(el.id, {
        instance: el,
        metadata: {
          initiatedBy: el.creator,
          correlationId: el.id,
        },
      }));
      __dualEvts2.forEach((ev: any) => this.eventBus.publish(ev));
      this.eventPublisher.publishAll(__dualEvts2);
    }
    return result;
  }

  
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierRepository.name)
      .get(ClientLoyaltyTierRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<ClientLoyaltyTier>('updateClientLoyaltyTier',args[0], args[1]), ttl: 60 })
  async update(
    id: string,
    partialEntity: Partial<ClientLoyaltyTier>
  ): Promise<ClientLoyaltyTier | null> {
    logger.info('Ready to update ClientLoyaltyTier on repository:', partialEntity);
    let result = await this.repository.update(id, partialEntity);
    logger.info('update ClientLoyaltyTier on repository was successfully :', partialEntity);
    let instance=await this.clientloyaltytierRepository.findById(id);
    logger.info('Updated instance of ClientLoyaltyTier with id: ${id} was finded on repository:', instance);
    
    if(instance && this.shouldPublishEvent()) {
      logger.info('Ready to publish or fire event ClientLoyaltyTierUpdatedEvent on repository:', instance);
      const __dualEvt3 = new ClientLoyaltyTierUpdatedEvent(instance.id, {
          instance: instance,
          metadata: {
            initiatedBy: instance.createdBy || 'system',
            correlationId: id,
          },
        });
      this.eventBus.publish(__dualEvt3);
      this.eventPublisher.publish(__dualEvt3);
    }   
    return instance;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierRepository.name)
      .get(ClientLoyaltyTierRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<ClientLoyaltyTier[]>('updateClientLoyaltyTiers',args[0], args[1]), ttl: 60 })
  async bulkUpdate(entities: Partial<ClientLoyaltyTier>[]): Promise<ClientLoyaltyTier[]> {
    const updatedEntities: ClientLoyaltyTier[] = [];
    logger.info('Ready to update '+entities.length+' entities on repository:', entities);
    
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
          if (this.shouldPublishEvent()) {
            const __dualEvt4 = new ClientLoyaltyTierUpdatedEvent(updatedEntity.id, {
                instance: updatedEntity,
                metadata: {
                  initiatedBy: updatedEntity.createdBy || 'system',
                  correlationId: entity.id,
                },
              });
            this.eventBus.publish(__dualEvt4);
            this.eventPublisher.publish(__dualEvt4);
          }
        }
      }
    }
    logger.info('Already updated '+updatedEntities.length+' entities on repository:', updatedEntities);
    return updatedEntities;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierRepository.name)
      .get(ClientLoyaltyTierRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string>('deleteClientLoyaltyTier',args[0]), ttl: 60 })
  async delete(id: string): Promise<DeleteResult> {
     logger.info('Ready to delete entity with id: ${id} on repository:', id);
     const entity = await this.clientloyaltytierRepository.findOne({ id });
     if(!entity){
      throw new NotFoundException(`No se encontro el id: ${id}`);
     }
     const result = await this.repository.delete({ id });
     logger.info('Entity deleted with id: ${id} on repository:', result);
     
     if (this.shouldPublishEvent()) {
       logger.info('Ready to publish/fire ClientLoyaltyTierDeletedEvent on repository:', result);
       const __dualEvt5 = new ClientLoyaltyTierDeletedEvent(id, {
        instance: entity,
        metadata: {
          initiatedBy: entity.createdBy || 'system',
          correlationId: entity.id,
        },
      });
       this.eventBus.publish(__dualEvt5);
       this.eventPublisher.publish(__dualEvt5);
     }
     return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ClientLoyaltyTierRepository.name)
      .get(ClientLoyaltyTierRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string[]>('deleteClientLoyaltyTiers',args[0]), ttl: 60 })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
    const result = await this.repository.delete(ids);
    logger.info('Already deleted '+ids.length+' entities on repository:', result);
    
    if (this.shouldPublishEvent()) {
      logger.info('Ready to publish/fire ClientLoyaltyTierDeletedEvent on repository:', result);
      const __dualEvts6 = await Promise.all(ids.map(async (id) => {
          const entity = await this.clientloyaltytierRepository.findOne({ id });
          if(!entity){
            throw new NotFoundException(`No se encontro el id: ${id}`);
          }
          return new ClientLoyaltyTierDeletedEvent(id, {
            instance: entity,
            metadata: {
              initiatedBy: entity.createdBy || 'system',
              correlationId: entity.id,
            },
          });
        }));
      __dualEvts6.forEach((ev: any) => this.eventBus.publish(ev));
      this.eventPublisher.publishAll(__dualEvts6);
    }
    return result;
  }
}


