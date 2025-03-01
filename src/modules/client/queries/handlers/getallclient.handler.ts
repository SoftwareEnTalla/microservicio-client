import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllClientQuery } from '../getallclient.query';

@QueryHandler(GetAllClientQuery)
export class GetAllClientHandler implements IQueryHandler<GetAllClientQuery> {
  async execute(query: GetAllClientQuery) {
    // Implementar lógica de la query
  }
}
