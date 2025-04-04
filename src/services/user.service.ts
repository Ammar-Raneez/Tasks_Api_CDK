import { IUserDoc } from '../models';

import { logger, ThrowError } from '../utils';
import { userDao } from '../dao';

export const fetchAndCacheUsers = async (): Promise<IUserDoc[]> => {
  logger.info('userService - fetchAndCacheUsers()');

  try {
    return await userDao.fetchAndCacheUsers();
  } catch (error) {
    throw ThrowError(error);
  }
};
