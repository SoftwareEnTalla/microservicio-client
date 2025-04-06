import { ICommand } from '@nestjs/cqrs';

export abstract class BaseCommand implements ICommand {
   //Constructor de BaseCommand
  constructor(public readonly metadata?: Record<string, any>) {
    //Aquí coloca implementación escencial no más de BaseCommand
  }
}
