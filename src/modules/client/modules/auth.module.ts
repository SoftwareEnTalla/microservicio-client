import { Module } from "@nestjs/common";
import { ClientCommandController } from "../controllers/clientcommand.controller";
import { ClientLoggingInterceptor } from "../interceptors/client.logging.interceptor";
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { ClientAuthGuard } from "../guards/clientauthguard.guard";

@Module({
  controllers: [ClientCommandController],
  providers: [
    ClientAuthGuard,
    ClientLoggingInterceptor,
    CommandBus,
    EventBus,
    UnhandledExceptionBus,
  ],
  exports: [ClientAuthGuard, CommandBus, EventBus, UnhandledExceptionBus],
})
export class AuthClientModule {}
