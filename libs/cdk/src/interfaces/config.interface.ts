export interface Config {
  parameters: {
    serverPort: number;
    gitRepo: {
      name: string;
      owner: string;
      branch: string;
      connectionArn: string;
    };
    application: {
      APP_PORT: string;
      APP_VERSION: string;
      CACHE_TTL: string;
      EXTERNAL_API: string;
    };
    database: {
      DB_URI: string;
    };
  };
}
