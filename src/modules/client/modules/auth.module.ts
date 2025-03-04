import { Module } from "@nestjs/common";
import { ClientCommandController } from "../controllers/clientcommand.controller";
import { ClientCommandService } from "../services/clientcommand.service";
import { ClientCommandRepository } from "../repositories/clientcommand.repository";
import { ClientResolver } from "../graphql/client.resolver";
import { ClientAuthGuard } from "../guards/auth.guard";
import { ClientLoggingInterceptor } from "../interceptors/logging.interceptor";

@Module({
  controllers: [ClientCommandController],
  providers: [
    ClientCommandService,
    ClientCommandRepository,
    ClientResolver,
    ClientAuthGuard,
    ClientLoggingInterceptor,
  ],
})
export class AuthClientModule {}
