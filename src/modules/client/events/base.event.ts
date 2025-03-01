import { IEvent } from '@nestjs/cqrs';

export abstract class BaseEvent implements IEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}
export abstract class BaseFailedEvent implements IEvent {
  constructor(public readonly error:Error,public readonly event:any) {}
}
