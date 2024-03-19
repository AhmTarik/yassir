import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { firstValueFrom } from "rxjs";
import { CustomConfigService } from "../config";
import axios, { AxiosError } from "axios"; // Import AxiosError directly

@Injectable()
export class WeatherRepository extends BaseRepository {
  constructor(
    private readonly config: CustomConfigService,
    protected readonly httpService: HttpService
  ) {
    super(httpService);
  }

  /**
   * Returns the current top 500 stories from hacker news API.
   * @returns {any}
   */
  async getAirQuality(latitude: number, longitude: number): Promise<any> {
    try {
      const apiKey = this.config.iqAirApiKey;

      const url = `${this.config.iqAirBaseURL}/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${apiKey}`;
      const response = await firstValueFrom<any>(this.get<any>(url));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error))
        throw new HttpException(
          "Latitude or longitude is invalid.",
          HttpStatus.BAD_REQUEST
        );
      Logger.log(error, `[weatherRepository getAirQuality:error]`);
      throw error;
    }
  }
}
