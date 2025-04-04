import { HttpServer } from './servers';

import { AppConfig } from './common/config';

import { ExpressLoader, MongoDBLoader } from './loaders';

import { logger } from './utils';

class App {
  private httpServer: HttpServer;

  constructor() {
    this.httpServer = new HttpServer();
    this.loadLoaders();
  }

  private loadLoaders(): void {
    const expressLoader = new ExpressLoader(this.httpServer.getApp());
    MongoDBLoader.getInstance();
    expressLoader.load();
  }

  public startServer(): void {
    const port = AppConfig.APP_PORT;
    if (port) {
      this.httpServer.listen(parseInt(port), () => {
        logger.info(`✅ Server started successfully on port ${port}!`);
      });
    }
  }
}

const app = new App();
app.startServer();
