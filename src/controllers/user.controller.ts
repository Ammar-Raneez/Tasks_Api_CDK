import { Request, Response } from 'express';

import { userService } from '../services';

import { ERRORS } from '../common/constants';
import { HTTPSTATUS } from '../common/enums';
import { cb, cbError } from '../common/handler';

import { logger } from '../utils';

export const getUsers = async (_: Request, res: Response) => {
  logger.info('userController - getUsers()');

  try {
    const response = await userService.fetchAndCacheUsers();
    return cb(HTTPSTATUS.OK, res, response);
  } catch (error) {
    return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.GET_FAILED, error);
  }
};
