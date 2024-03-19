import { AirQuality } from "models/air-quality.model";
import { weatherService } from "./weather.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CustomConfigService } from "../config";
import { BaseRepository } from "../repository/base.repository";
import { WeatherRepository } from "../repository/weather.repository";
import { HttpModule } from "@nestjs/axios";
import { HttpException, HttpStatus } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";

describe("weatherService", () => {
  let service: weatherService;
  let airQualityModel: Model<AirQuality>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: getModelToken("AirQuality"),
          useValue: {
            findOne: jest.fn(),
          },
        },
        BaseRepository,
        CustomConfigService,
        WeatherRepository,
        weatherService,
      ],
    }).compile();

    service = await module.resolve<weatherService>(weatherService);
    airQualityModel = await module.resolve<Model<AirQuality>>(
      getModelToken("AirQuality")
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Get Air Quality TESTS", () => {
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

  describe("Get Most Polluted Time TESTS", () => {
    it("should return the most polluted time", async () => {
      const mockAirQualityData = {
        timestamp: new Date("2024-03-18T12:00:00Z"),
        aqi: 150,
      };

      jest.spyOn(airQualityModel, "findOne").mockImplementation(
        () =>
          ({
            sort: jest.fn().mockReturnValueOnce({
              limit: jest.fn().mockResolvedValueOnce(mockAirQualityData),
            }),
          }) as any
      );

      const result = await service.getMostPollutedTime();

      expect(result).toEqual(mockAirQualityData.timestamp);
    });

    it("should return null if no data is found", async () => {
      jest.spyOn(airQualityModel, "findOne").mockImplementation(
        () =>
          ({
            sort: jest.fn().mockReturnValueOnce({
              limit: jest.fn().mockResolvedValueOnce(null),
            }),
          }) as any
      );

      const result = await service.getMostPollutedTime();

      expect(result).toBeUndefined();
    });

    it("should throw an error if an error occurs during data retrieval", async () => {
      jest.spyOn(airQualityModel, "findOne").mockImplementation(
        () =>
          ({
            sort: jest.fn().mockReturnValueOnce({
              limit: jest
                .fn()
                .mockResolvedValueOnce(new Error("Database error")),
            }),
          }) as any
      );

      try {
        const result = await service.getMostPollutedTime();
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe("Database error");
      }
    });
  });
});
