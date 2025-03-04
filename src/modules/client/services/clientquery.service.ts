import { Injectable } from "@nestjs/common";
import { ClientQueryRepository } from "../repositories/clientquery.repository";
import { Client } from "../entities/client.entity";
@Injectable()
export class ClientQueryService {
  constructor(private readonly repository: ClientQueryRepository<Client>) {}

  // Implementar lógica de negocio aquí
  findAll(): Promise<Client[]> {
    return this.repository.findAll();
  }
  findById(id: string): Promise<Client> {
    throw new Error("Method not implemented.");
  }
}
