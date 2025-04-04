import { Application, Router } from 'express';

import taskRouter from './task.routes';
import userRouter from './user.routes';

import { APIS, ERRORS } from '../common/constants';
import { AppConfig } from '../common/config';
import { HTTPSTATUS } from '../common/enums';
import { cb, cbError } from '../common/handler';

export async function SetRoutes(app: Application) {
  const apiRouter = Router();

  app.use('/health', (_, res) => {
    return cb(HTTPSTATUS.OK, res, {
      status: 'OK',
      version: AppConfig.APP_VERSION,
    });
  });

  app.use('/api', apiRouter);
  apiRouter.use(`/${APIS.TASKS}`, taskRouter);
  apiRouter.use(`/${APIS.USERS}`, userRouter);

  app.use((req, res) => {
    return cbError(res, HTTPSTATUS.NOT_FOUND, ERRORS.API_NOT_FOUND, { endPoint: req.path });
  });
}
