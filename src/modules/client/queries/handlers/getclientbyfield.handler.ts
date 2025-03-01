import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetClientByFieldQuery } from '../getclientbyfield.query';

@QueryHandler(GetClientByFieldQuery)
export class GetClientByFieldHandler implements IQueryHandler<GetClientByFieldQuery> {
  async execute(query: GetClientByFieldQuery) {
    // Implementar lógica de la query
  }
}
