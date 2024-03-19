import { Injectable } from "@nestjs/common";
import { WeatherRepository } from "../repository/weather.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AirQuality } from "models/air-quality.model";

@Injectable()
export class weatherService {
  constructor(
    private readonly weatherRepository: WeatherRepository,
    @InjectModel("AirQuality") private airQualityModel: Model<AirQuality>
  ) {}

  /**
   * Get datetime( date and time ) where the paris zone is the most polluted.
   * @returns {Date | null} date time or null
   * @throws {Error} If an error occurs during data retrieval or processing.
   */
  async getMostPollutedTime(): Promise<Date | null> {
    const mostPollutedData = await this.airQualityModel
      .findOne()
      .sort({ aqi: -1 })
      .limit(1);
    return mostPollutedData?.timestamp;
  }

  /**
   * Retrieves The “air quality “ for the given zone
   * @param latitude - The latitude of given area.
   * @param longitude - The longitude of given area.
   * @returns A Promise that resolves to an object containing air quality information.
   * @throws {Error} If an error occurs during data retrieval or processing.
   */
  async getAirQuality(latitude: number, longitude: number): Promise<any> {
    const airQuality = await this.weatherRepository.getAirQuality(
      latitude,
      longitude
    );
    return airQuality;
  }
}
