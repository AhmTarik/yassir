import { Test, TestingModule } from "@nestjs/testing";
import { CustomConfigService } from "../config";
import { BaseRepository } from "./base.repository";
import { WeatherRepository } from "./weather.repository";
import { HttpModule } from "@nestjs/axios";
import { AxiosError } from "axios";
import { HttpException, HttpStatus, Logger } from "@nestjs/common";

describe("weatherRepository", () => {
  let service: WeatherRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [BaseRepository, CustomConfigService, WeatherRepository],
    }).compile();

    service = await module.resolve<WeatherRepository>(WeatherRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAirQuality fn", () => {
    it("should get 'air quality' result for the 'Paris' zone ", async () => {
      const parisCoordinates = {
        lat: 48.856613,
        lon: 2.352222,
      };
      const result = await service.getAirQuality(
        parisCoordinates.lat,
        parisCoordinates.lon
      );
      expect(result).toBeInstanceOf(Object);
      expect(result.city).toEqual("Paris");
      expect(result.country).toEqual("France");
      expect(result.current).toBeInstanceOf(Object);
      expect(result.current.pollution).toBeInstanceOf(Object);
    });

    it("should get 'air quality' result for the 'New Cairo' zone ", async () => {
      const cairoCoordinates = {
        lat: 30.0121677,
        lon: 31.4341894,
      };
      const result = await service.getAirQuality(
        cairoCoordinates.lat,
        cairoCoordinates.lon
      );
      expect(result).toBeInstanceOf(Object);
      expect(result.city).toEqual("New Cairo");
      expect(result.country).toEqual("Egypt");
      expect(result.current).toBeInstanceOf(Object);
      expect(result.current.pollution).toBeInstanceOf(Object);
    });

    it("should throw BAD REQUEST ERROR for invalid credential lat:2.352222 & lon:48.856613", async () => {
      const parisCoordinates = {
        lon: 48.856613,
        lat: 2.352222,
      };
      const expectedError = new HttpException(
        "Latitude or longitude is invalid.",
        HttpStatus.BAD_REQUEST
      );
      try {
        await service.getAirQuality(parisCoordinates.lat, parisCoordinates.lon);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe(expectedError.message);
        expect(error.status).toBe(expectedError.getStatus());
      }
    });
  });
});
