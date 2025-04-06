import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class ClientAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    
    // Ejemplo: Verificación de JWT
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) return false;

    // Lógica de validación de token
    return this.validateToken(token);
  }

  private validateToken(token: string): boolean {
    // Implementar lógica real de validación
    return token === 'valid-token';
  }
}
