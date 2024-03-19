import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AirQuality } from "models/air-quality.model";
import { Model } from "mongoose";
import { weatherService } from "../service/weather.service";

@Injectable()
export class WeatherCronService {
  private readonly logger = new Logger(WeatherCronService.name);
  constructor(
    @InjectModel("AirQuality") private airQualityModel: Model<AirQuality>,
    @Inject(weatherService) private readonly weatherService: weatherService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkParisAirQualityCRON() {
    try {
      const parisCoordinates = {
        lat: 48.856613,
        lon: 2.352222,
      };
      const airQualityData = await this.weatherService.getAirQuality(
        parisCoordinates.lat,
        parisCoordinates.lon
      );

      this.logger.log(airQualityData);
      const newAirQualityRecord = new this.airQualityModel({
        location: "Paris",
        aqi: airQualityData.current.pollution.aqius,
        timestamp: airQualityData.current.pollution.ts,
        createdAt: new Date(),
      });

      const exist = await this.airQualityModel.findOne({
        location: "Paris",
        timestamp: airQualityData.current.pollution.ts,
        aqi: airQualityData.current.pollution.aqius,
      });
      if (!exist) {
        // Save this data
        await newAirQualityRecord.save();
        this.logger.log(
          "Successfully fetched and saved Paris air quality data"
        );
      }
    } catch (error) {
      this.logger.error(error, "[Error in checkParisAirQualityCRON]");
    }
  }
}
