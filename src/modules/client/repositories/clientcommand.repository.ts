/*
 * Copyright (c) 2025 SoftwarEnTalla
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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  UpdateResult,
} from 'typeorm';


import { BaseEntity } from '../entities/base.entity';
import { Client } from '../entities/client.entity';
import { ClientQueryRepository } from './clientquery.repository';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {ClientRepository} from './client.repository';

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

//Events and EventHandlers
import { IEventHandler } from '@nestjs/cqrs';
import { ClientCreatedEvent } from '../events/clientcreated.event';
import { ClientUpdatedEvent } from '../events/clientupdated.event';
import { ClientDeletedEvent } from '../events/clientdeleted.event';

//Enfoque Event Sourcing
import { CommandBus } from '@nestjs/cqrs';
import { EventStoreService } from '../shared/event-store/event-store.service';
import { KafkaEventPublisher } from '../shared/adapters/kafka-event-publisher';
import { BaseEvent } from '../events/base.event';


@Injectable()
export class ClientCommandRepository implements IEventHandler<BaseEvent>{

  //Constructor del repositorio de datos: ClientCommandRepository
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
    private readonly clientRepository: ClientQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(Client.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${Client.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
      );
    }
  }


  // ----------------------------
  // MÉTODOS DE PROYECCIÓN (Event Handlers) para enfoque Event Sourcing
  // ----------------------------

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  async handle(event: any) {
    logger.info('Ready to handle Client event on repository:', event);
    switch (event.constructor.name) {
      case 'ClientCreatedEvent':
        return await this.onClientCreated(event);
      case 'ClientUpdatedEvent':
        return await this.onClientUpdated(event);
      case 'ClientDeletedEvent':
        return await this.onClientDeleted(event);
      // Añade más casos según necesites
    }
    return false;
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<Client>('createClient', args[0], args[1]),
    ttl: 60,
  })
  private async onClientCreated(event: ClientCreatedEvent) {
    logger.info('Ready to handle onClientCreated event on repository:', event);
    const entity = new Client();
    entity.id = event.aggregateId;
    // Mapea todos los campos del evento a la entidad
    Object.assign(entity, event.payload.instance);
    logger.info('Ready to save entity from event\'s payload:', entity);
    return await this.repository.save(entity);
    // Limpia caché si es necesario
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<Client>('updateClient', args[0], args[1]),
    ttl: 60,
  })
  private async onClientUpdated(event: ClientUpdatedEvent) {
    logger.info('Ready to handle onClientUpdated event on repository:', event);
    return await this.repository.update(
      event.aggregateId,
      event.payload.instance
    );
    // Limpia caché relacionada
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<Client>('deleteClient', args[0], args[1]),
    ttl: 60,
  })
  private async onClientDeleted(event: ClientDeletedEvent) {
    logger.info('Ready to handle onClientDeleted event on repository:', event);
    return await this.repository.delete(event.aggregateId);
    // Limpia caché
  }


  // ----------------------------
  // MÉTODOS CRUD TRADICIONALES (Compatibilidad)
  // ----------------------------
 
  
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<Client>('createClient',args[0], args[1]), ttl: 60 })
  async create(entity: Client): Promise<Client> {
    logger.info('Ready to create Client on repository:', entity);
    const result = await this.repository.save(entity);
    logger.info('New instance of Client was created with id:'+ result.id+' on repository:', result);
    this.eventPublisher.publish(new ClientCreatedEvent(result.id, {
      instance: result,
      metadata: {
        initiatedBy: result.creator,
        correlationId: result.id,
      },
    }));
    return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<Client[]>('createClients',args[0], args[1]), ttl: 60 })
  async bulkCreate(entities: Client[]): Promise<Client[]> {
    logger.info('Ready to create Client on repository:', entities);
    const result = await this.repository.save(entities);
    logger.info('New '+entities.length+' instances of Client was created on repository:', result);
    this.eventPublisher.publishAll(result.map((el)=>new ClientCreatedEvent(el.id, {
      instance: el,
      metadata: {
        initiatedBy: el.creator,
        correlationId: el.id,
      },
    })));
    return result;
  }

  
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<Client>('updateClient',args[0], args[1]), ttl: 60 })
  async update(
    id: string,
    partialEntity: Partial<Client>
  ): Promise<Client | null> {
    logger.info('Ready to update Client on repository:', partialEntity);
    let result = await this.repository.update(id, partialEntity);
    logger.info('update Client on repository was successfully :', partialEntity);
    let instance=await this.clientRepository.findById(id);
    logger.info('Updated instance of Client with id:  was finded on repository:', instance);
    if(instance){
     logger.info('Ready to publish or fire event ClientUpdatedEvent on repository:', instance);
     this.eventPublisher.publish(new ClientUpdatedEvent(instance.id, {
          instance: instance,
          metadata: {
            initiatedBy: instance.createdBy || 'system',
            correlationId: id,
          },
        }));
    }   
    return instance;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<Client[]>('updateClients',args[0], args[1]), ttl: 60 })
  async bulkUpdate(entities: Partial<Client>[]): Promise<Client[]> {
    const updatedEntities: Client[] = [];
    logger.info('Ready to update '+entities.length+' entities on repository:', entities);
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
          this.eventPublisher.publish(new ClientUpdatedEvent(updatedEntity.id, {
              instance: updatedEntity,
              metadata: {
                initiatedBy: updatedEntity.createdBy || 'system',
                correlationId: entity.id,
              },
            }));
        }
      }
    }
    logger.info('Already updated '+updatedEntities.length+' entities on repository:', updatedEntities);
    return updatedEntities;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string>('deleteClient',args[0]), ttl: 60 })
  async delete(id: string): Promise<DeleteResult> {
     logger.info('Ready to delete  entity with id:  on repository:', id);
     const entity = await this.clientRepository.findOne({ id });
     if(!entity){
      throw new NotFoundException(`No se encontro el id: ${id}`);
     }
     const result = await this.repository.delete({ id });
     logger.info('Entity deleted with id:  on repository:', result);
     logger.info('Ready to publish/fire ClientDeletedEvent on repository:', result);
     this.eventPublisher.publish(new ClientDeletedEvent(id, {
      instance: entity,
      metadata: {
        initiatedBy: entity.createdBy || 'system',
        correlationId: entity.id,
      },
    }));
     return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(ClientRepository.name)
      .get(ClientRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string[]>('deleteClients',args[0]), ttl: 60 })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
    const result = await this.repository.delete(ids);
    logger.info('Already deleted '+ids.length+' entities on repository:', result);
    logger.info('Ready to publish/fire ClientDeletedEvent on repository:', result);
    this.eventPublisher.publishAll(ids.map(async (id) => {
        const entity = await this.clientRepository.findOne({ id });
        if(!entity){
          throw new NotFoundException(`No se encontro el id: ${id}`);
        }
        return new ClientDeletedEvent(id, {
          instance: entity,
          metadata: {
            initiatedBy: entity.createdBy || 'system',
            correlationId: entity.id,
          },
        });
      }));
    return result;
  }
}


