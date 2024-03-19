import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { weatherModule } from "./module/weather.module";
import { CustomConfigService } from "config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { WeatherCronService } from "cron/weather.cron.service";
import { AirQualitySchema } from "models/air-quality.model";
@Module({
  imports: [
    weatherModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    MongooseModule.forRoot(new CustomConfigService().mongoDBConnectionString),
    MongooseModule.forFeature([
      { name: "AirQuality", schema: AirQualitySchema },
    ]),
  ],
  controllers: [AppController],
  providers: [CustomConfigService, WeatherCronService],
  exports: [CustomConfigService],
})
export class AppModule {}
