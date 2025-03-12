import { NestFactory } from "@nestjs/core";
import { ClientAppModule } from "./app.module";
import { AppDataSource } from "./data-source";

async function bootstrap() {
  await AppDataSource.initialize();
  console.log("📦 Base de datos conectada");

  const app = await NestFactory.create(ClientAppModule);
  await app.listen(3000);
}
bootstrap();
