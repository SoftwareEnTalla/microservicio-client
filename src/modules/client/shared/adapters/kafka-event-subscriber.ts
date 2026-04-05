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
import { EventBus } from '@nestjs/cqrs';
import { KafkaService } from '../messaging/kafka.service';
  import { EVENT_REGISTRY, EVENT_TOPICS } from '../../events/event-registry';

@Injectable()
export class KafkaEventSubscriber {
  private readonly logger = new Logger(KafkaEventSubscriber.name);
  private initialized = false;

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly eventBus: EventBus
  ) {}

  async initializeSubscriptions() {
    if (this.initialized) {
      return;
    }
    if (process.env.KAFKA_ENABLED !== 'true') {
      this.logger.warn('Kafka está deshabilitado. No se inicializan suscriptores.');
      return;
    }
    await this.kafkaService.connect();
    await this.setupSubscriptions();
    this.initialized = true;
  }

  private async setupSubscriptions() {
      if (EVENT_TOPICS.length === 0) {
        this.logger.warn('No hay tópicos registrados para suscripción Kafka.');
        return;
      }
      await this.kafkaService.subscribe(EVENT_TOPICS, (message, metadata) => {
        this.routeExternalEvent(message, metadata);
    });
  }

    private routeExternalEvent(message: any, metadata: any) {
    try {
        const eventType = this.extractHeaderValue(metadata?.headers?.['event-type']);
        const topic = metadata?.topic;
        const eventClass = this.resolveEventClass(topic, eventType);
      
      if (!eventClass) {
          this.logger.warn('No handler for event type: ' + String(eventType || topic || 'unknown'));
        return;
      }

        const aggregateId = String(message?.aggregateId ?? message?.id ?? message?.payload?.metadata?.correlationId ?? 'unknown-aggregate');
        const payload = message?.payload ?? message;
        const event = new eventClass(aggregateId, payload);
      this.eventBus.publish(event);
    } catch (error:any) {
      this.logger.error(`Error processing external event: ${error.message}`, error.stack);
    }
  }

    private resolveEventClass(topic?: string, eventType?: string): (new (...args: any[]) => any) | undefined {
      const normalizedTopic = topic || this.normalizeEventTypeToTopic(eventType);
      return normalizedTopic ? EVENT_REGISTRY[normalizedTopic] : undefined;
    }

    private extractHeaderValue(header: any): string | undefined {
      if (!header) {
        return undefined;
      }
      if (typeof header === 'string') {
        return header;
      }
      if (Buffer.isBuffer(header)) {
        return header.toString('utf-8');
      }
      return String(header);
    }

    private normalizeEventTypeToTopic(eventType?: string): string | undefined {
      if (!eventType) {
        return undefined;
      }
      return eventType
        .replace(/Event$/, '')
        .replace(/([a-z])([A-Z])/g, (_match, first, second) => first + '-' + second)
        .toLowerCase();
  }
}

