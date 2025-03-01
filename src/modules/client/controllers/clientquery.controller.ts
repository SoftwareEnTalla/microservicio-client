import { Controller } from '@nestjs/common';
import { ClientQueryService } from '../services/clientquery.service';
import { FindManyOptions } from "typeorm";

@Controller('ClientQueryController')
export class ClientQueryController {
  constructor(private readonly service: ClientQueryService) {}
  
  // Implementar endpoints aquí
}
