import { NestFactory } from "@nestjs/core";
import { ClientAppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(ClientAppModule);
  await app.listen(3000);
}
bootstrap();
