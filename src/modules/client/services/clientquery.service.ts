import { Injectable } from '@nestjs/common';
import { ClientQueryRepository } from '../repositories/clientquery.repository';

@Injectable()
export class ClientQueryService {
  constructor(private readonly repository: ClientQueryRepository) {}
  
  // Implementar lógica de negocio aquí
}
