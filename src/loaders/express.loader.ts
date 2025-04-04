import { Application } from 'express';
import bodyParser from 'body-parser';
import * as httpContext from 'express-http-context';

import morgan from 'morgan';
import helmet from 'helmet';
import * as rfs from 'rotating-file-stream';

import { ENVIRONMENTS } from '../common/constants';
import { AppConfig } from '../common/config';
import { apiRateLimiter } from '../common/middlewares';

import { SetRoutes } from '../routes/routes';

export class ExpressLoader {
  constructor(private app: Application) {
    this.app = app;
  }

  loadMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(apiRateLimiter);
    this.app.use(httpContext.middleware as any);

    const accessLogStream = rfs.createStream(`logs/access.log`, {
      interval: '1d',
      compress: 'gzip',
    });

    if (AppConfig.APP_ENV == ENVIRONMENTS.DEV) {
      this.app.use(morgan('tiny'));
    } else {
      this.app.use(morgan('tiny', { stream: accessLogStream }));
    }

    // Add FE Origin
    //this.app.use(
    //  cors({
    //    origin: '',
    //    credentials: true,
    //    allowedHeaders: ['Content-Type', 'X-Requested-With', 'Accept', 'Origin', 'Cookie'],
    //    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    //    exposedHeaders: ['Set-Cookie'],
    //  }),
    //);
  }

  loadRoutes() {
    SetRoutes(this.app);
  }

  load() {
    this.loadMiddleware();
    this.loadRoutes();
  }
}
