import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Query,
  Res,
  Response,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { weatherService } from "../service/weather.service";

const LATITUDE_RANGE: [number, number] = [-90, 90];
const LONGITUDE_RANGE: [number, number] = [-180, 180];

@Controller("weather")
@ApiTags("weather")
export class weatherController {
  constructor(private readonly weatherService: weatherService) {}

  private isValidLatitude(latitude: number): boolean {
    return latitude >= LATITUDE_RANGE[0] && latitude <= LATITUDE_RANGE[1];
  }

  private isValidLongitude(longitude: number): boolean {
    return longitude >= LONGITUDE_RANGE[0] && longitude <= LONGITUDE_RANGE[1];
  }

  @ApiOperation({
    summary: "Get datetime where the paris zone is the most polluted",
  })
  @Get("paris/most-polluted")
  async getMostPollutedTime() {
    return this.weatherService.getMostPollutedTime();
  }

  @ApiOperation({ summary: `Get "air quality" for the given zone` })
  @Get("/air-quality")
  async getAirQuality(
    @Query("latitude") latitude: number,
    @Query("longitude") longitude: number
  ) {
    if (!this.isValidLatitude(latitude) || !this.isValidLongitude(longitude)) {
      throw new HttpException(
        "Bad request. Latitude or longitude is invalid.",
        HttpStatus.BAD_REQUEST
      );
    }
    const result = await this.weatherService.getAirQuality(latitude, longitude);
    if (!result || !result.current)
      throw new NotFoundException({ messagae: "Not Found", success: false });
    return {
      Result: {
        Pollution: result?.current?.pollution,
      },
    };
  }
}
