import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class ClientInterceptor implements NestInterceptor {
  constructor(private readonly eventBus: EventBus) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    
    // Logging pre-ejecución
    console.log(`Incoming request: ${request.method} ${request.url}`);

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        // Logging post-ejecución
        console.log(`Request completed in ${Date.now() - now}ms`);
        
        // Ejemplo: Publicar evento de auditoría
        // this.eventBus.publish(new RequestCompletedEvent(context));
      })
    );
  }
}
