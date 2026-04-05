/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 */

import { describe, expect, it } from '@jest/globals';
import { EventIdempotencyService } from './event-idempotency.service';

describe('EventIdempotencyService', () => {
  it('marca un evento como procesado y evita duplicados', () => {
    const service = new EventIdempotencyService();
    const key = service.buildKey('client-created', 'aggregate-1', { eventId: 'evt-1' });

    expect(service.hasProcessed(key)).toBe(false);
    service.markProcessed(key);
    expect(service.hasProcessed(key)).toBe(true);
    service.release(key);
    expect(service.hasProcessed(key)).toBe(false);
    service.onModuleDestroy();
  });
});