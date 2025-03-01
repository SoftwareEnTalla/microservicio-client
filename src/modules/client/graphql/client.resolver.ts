import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClientDto } from '../dtos/client.dto';
import { ClientService } from '../services/client.service';
import {
  CreateClientCommand,
  UpdateClientCommand,
  DeleteClientCommand
} from '../commands';
import { CommandBus } from '@nestjs/cqrs';

@Resolver(() => ClientDto)
export class ClientResolver {
  constructor(
    private readonly service: ClientService,
    private readonly commandBus: CommandBus
  ) {}

  @Mutation(() => ClientDto)
  async createClient(
    @Args('input') input: ClientDto
  ): Promise<ClientDto> {
    return this.commandBus.execute(new CreateClientCommand(input));
  }

  @Mutation(() => ClientDto)
  async updateClient(
    @Args('id') id: string,
    @Args('input') input: ClientDto
  ): Promise<ClientDto> {
    return this.commandBus.execute(new UpdateClientCommand(id, input));
  }

  @Mutation(() => Boolean)
  async deleteClient(@Args('id') id: string): Promise<boolean> {
    return this.commandBus.execute(new DeleteClientCommand(id));
  }

  @Query(() => [ClientDto])
  clients(): Promise<ClientDto[]> {
    return this.service.findAll();
  }

  @Query(() => ClientDto)
  client(@Args('id') id: string): Promise<ClientDto> {
    return this.service.findById(id);
  }
}
