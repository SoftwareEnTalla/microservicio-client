import { Module } from "@nestjs/common";
import { HttpLoggerClient } from "src/common/logger/http-logger.client";
import { LoggerClient } from "src/common/logger/logger.client";
import * as dotenv from "dotenv";

dotenv.config();

@Module({
  providers: [
    {
      provide: LoggerClient,
      useFactory: () => {
        const client = new LoggerClient();
        client.registerClient(
          process.env.KEY_LOG || "Client",
          new HttpLoggerClient(
            process.env.LOG_API_BASE_URL || "https://logs.api"
          )
        );
        return client;
      },
    },
  ],
  exports: [LoggerClient],
})
export class LoggingModule {}

