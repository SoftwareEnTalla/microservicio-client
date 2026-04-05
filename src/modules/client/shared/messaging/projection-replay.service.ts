/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 */

import { Injectable, Logger } from '@nestjs/common';
import { EVENT_TOPICS } from '../../events/event-registry';
import { KafkaEventSubscriber } from '../adapters/kafka-event-subscriber';

@Injectable()
export class ProjectionReplayService {
  private readonly logger = new Logger(ProjectionReplayService.name);

  constructor(private readonly kafkaEventSubscriber: KafkaEventSubscriber) {}

  async replayRegisteredEvents(): Promise<void> {
    this.logger.warn('Iniciando replay de proyecciones para tópicos: ' + EVENT_TOPICS.join(', '));
    await this.kafkaEventSubscriber.replayRegisteredEvents();
  }
}