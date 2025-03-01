import { Injectable } from '@nestjs/common';
import { ClientCommandRepository } from '../repositories/clientcommand.repository';

@Injectable()
export class ClientCommandService {
  constructor(private readonly repository: ClientCommandRepository) {}
  
  // Implementar lógica de negocio aquí
}
