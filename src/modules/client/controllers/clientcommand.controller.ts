import { Controller } from '@nestjs/common';
import { ClientCommandService } from '../services/clientcommand.service';
import { FindManyOptions } from "typeorm";

@Controller('ClientCommandController')
export class ClientCommandController {
  constructor(private readonly service: ClientCommandService) {}
  
  // Implementar endpoints aquí
}
