import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.DEFAULT })
export class CustomConfigService {
  public iqAirApiKey: string;
  public iqAirBaseURL: string;
  public mongoDBConnectionString: string;

  constructor() {
    this.iqAirApiKey =
      process.env.IQAIR_API_KEY || "d393bad6-704e-4f2b-a494-9ac7b2bad8a5";

    this.iqAirBaseURL =
      process.env.IQAIR_BASE_URL || "http://api.airvisual.com";

    this.mongoDBConnectionString =
      process.env.MONGO_DB_CONNECTION ||
      "mongodb+srv://testuser:qNcpC1skVd5tqWlK@cluster0.av9fuzs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  }
}
