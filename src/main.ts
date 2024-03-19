import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as swaggerUi from "swagger-ui-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle(`Mini-project "AIR QUALITY"`)
    .setDescription(
      "REST API responsible for exposing “the air quality information” of a nearest city to GPS coordinates using iqair"
    )
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(document));

  // enable shutdown hooks explicitly.
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  //app.useLogger();
  await app.listen(3000);
}
bootstrap();
