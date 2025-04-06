import { ObjectType, Field } from "@nestjs/graphql";
import { GQResponseBase } from "src/common/types/common.types";
import { Client } from "../entities/client.entity";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType({ description: "Respuesta de client" })
export class ClientResponse<T extends Client> extends GQResponseBase {
  @ApiProperty({ type: Client,nullable:false,description:"Datos de respuesta de Client" })
  @Field(() => Client, { description: "Instancia de Client", nullable: true })
  data?: T;
}

@ObjectType({ description: "Respuesta de clients" })
export class ClientsResponse<T extends Client> extends GQResponseBase {
  @ApiProperty({ type: [Client],nullable:false,description:"Listado de Client",default:[] })
  @Field(() => [Client], { description: "Listado de Client", nullable: false,defaultValue:[] })
  data: T[] = [];

  @ApiProperty({ type: Number,nullable:false,description:"Cantidad de Client",default:0 })
  @Field(() => Number, { description: "Cantidad de Client", nullable: false,defaultValue:0 })
  count: number = 0;
}




