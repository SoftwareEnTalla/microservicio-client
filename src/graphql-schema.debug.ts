
// src/graphql-schema.debug.ts
import { printSchema } from "graphql";
import { writeFileSync } from "fs";
import { NestFactory } from "@nestjs/core";
import { GraphQLSchemaHost } from "@nestjs/graphql";
import { ClientAppModule } from "./app.module";

async function debugSchema() {
  const app = await NestFactory.create(ClientAppModule);
  await app.init();

  const { schema } = app.get(GraphQLSchemaHost);
  writeFileSync("schema.gql", printSchema(schema));

  await app.close();
}

debugSchema().catch((err) => {
  console.error("Failed to generate schema:", err);
  process.exit(1);
});


