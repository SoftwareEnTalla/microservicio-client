import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ClientDto, CreateClientDto } from "../dtos/createclient.dto";
import { Client } from "../entities/client.entity";
import {
  CreateClientCommand,
  UpdateClientCommand,
  DeleteClientCommand,
} from "../commands/exporting.command";
import { CommandBus } from "@nestjs/cqrs";
import { UpdateClientDto } from "../dtos/updateclient.dto";

import { ClientQueryService } from "../services/clientquery.service";

@Resolver(() => ClientDto)
export class ClientResolver {
  constructor(
    private readonly service: ClientQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @Mutation(() => CreateClientDto)
  async createClient(
    @Args("input") input: CreateClientDto
  ): Promise<CreateClientDto> {
    return this.commandBus.execute(new CreateClientCommand(input));
  }

  @Mutation(() => UpdateClientDto)
  async updateClient(
    @Args("id") id: string,
    @Args("input") input: UpdateClientDto
  ): Promise<UpdateClientDto> {
    return this.commandBus.execute(new UpdateClientCommand(id, input));
  }

  @Mutation(() => Boolean)
  async deleteClient(@Args("id") id: string): Promise<boolean> {
    return this.commandBus.execute(new DeleteClientCommand(id));
  }

  @Query(() => [ClientDto])
  clients(): Promise<Client[]> {
    return this.service.findAll();
  }

  @Query(() => ClientDto)
  client(@Args("id") id: string): Promise<Client> {
    return this.service.findById(id);
  }
}
