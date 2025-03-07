import { Module } from "@nestjs/common";
import { ClientCommandController } from "./modules/client/controllers/clientcommand.controller";
import { ClientQueryController } from "./modules/client/controllers/clientquery.controller";
import { ClientCommandService } from "./modules/client/services/clientcommand.service";
import { ClientQueryService } from "./modules/client/services/clientquery.service";
import { AuthClientModule } from "./modules/client/modules/auth.module";
import { ClientModule } from "./modules/client/modules/client.module";

@Module({
  imports: [
    // Agrega aquí otros módulos que necesites
    AuthClientModule,
    ClientModule,
  ],
  controllers: [ClientCommandController, ClientQueryController], // Aquí defines los controladores
  providers: [ClientCommandService, ClientQueryService], // Aquí defines los servicios
})
export class ClientAppModule {}
