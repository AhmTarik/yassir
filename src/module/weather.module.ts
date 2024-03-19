import { Module } from "@nestjs/common";
import { weatherService } from "../service/weather.service";
import { WeatherRepository } from "../repository/weather.repository";
import { BaseRepository } from "../repository/base.repository";
import { HttpModule } from "@nestjs/axios";
import { CustomConfigService } from "../config";
import { weatherController } from "../controller/weather.controller";
import { AirQualitySchema } from "../models/air-quality.model";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: "AirQuality", schema: AirQualitySchema },
    ]),
  ],
  controllers: [weatherController],
  providers: [
    weatherService,
    WeatherRepository,
    BaseRepository,
    CustomConfigService,
  ],
  exports: [weatherService, CustomConfigService],
})
export class weatherModule {}
