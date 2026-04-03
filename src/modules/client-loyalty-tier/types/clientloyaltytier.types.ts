/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { ObjectType, Field } from "@nestjs/graphql";
import { GQResponseBase } from "src/common/types/common.types";
import { ClientLoyaltyTier } from "../entities/client-loyalty-tier.entity";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType({ description: "Respuesta de clientloyaltytier" })
export class ClientLoyaltyTierResponse<T extends ClientLoyaltyTier> extends GQResponseBase {
  @ApiProperty({ type: ClientLoyaltyTier,nullable:false,description:"Datos de respuesta de ClientLoyaltyTier" })
  @Field(() => ClientLoyaltyTier, { description: "Instancia de ClientLoyaltyTier", nullable: true })
  data?: T;
}

@ObjectType({ description: "Respuesta de clientloyaltytiers" })
export class ClientLoyaltyTiersResponse<T extends ClientLoyaltyTier> extends GQResponseBase {
  @ApiProperty({ type: [ClientLoyaltyTier],nullable:false,description:"Listado de ClientLoyaltyTier",default:[] })
  @Field(() => [ClientLoyaltyTier], { description: "Listado de ClientLoyaltyTier", nullable: false,defaultValue:[] })
  data: T[] = [];

  @ApiProperty({ type: Number,nullable:false,description:"Cantidad de ClientLoyaltyTier",default:0 })
  @Field(() => Number, { description: "Cantidad de ClientLoyaltyTier", nullable: false,defaultValue:0 })
  count: number = 0;
}




