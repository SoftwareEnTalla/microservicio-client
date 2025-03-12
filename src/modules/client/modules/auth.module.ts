import { Module } from "@nestjs/common";
import { ClientCommandController } from "../controllers/clientcommand.controller";
import { ClientAuthGuard } from "../guards/auth.guard";
import { ClientLoggingInterceptor } from "../interceptors/logging.interceptor";
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";

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
