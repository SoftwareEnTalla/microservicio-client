import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetClientByIdQuery } from '../getclientbyid.query';

@QueryHandler(GetClientByIdQuery)
export class GetClientByIdHandler implements IQueryHandler<GetClientByIdQuery> {
  async execute(query: GetClientByIdQuery) {
    // Implementar lógica de la query
  }
}
