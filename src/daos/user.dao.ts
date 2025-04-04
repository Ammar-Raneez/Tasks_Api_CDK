import axios from 'axios';

import { User, IUserDoc } from '../models';

import { AppConfig } from '../common/config';
import { IUser } from '../common/interfaces';

import { logger } from '../utils';

export const fetchAndCacheUsers = async (): Promise<IUserDoc[]> => {
  logger.info('userDao - fetchAndCacheUsers()');

  try {
    const cachedUsers = await User.find({
      cachedAt: { $gt: new Date(Date.now() - parseInt(AppConfig.CACHE_TTL || '0') * 1000) },
    });

    if (cachedUsers.length > 0) {
      return cachedUsers;
    }

    const response = await axios.get<IUser[]>(`${AppConfig.EXTERNAL_API}/users`);

    await User.deleteMany({});

    const usersToSave = (response.data as IUser[]).map((user) => ({
      externalId: user.id,
      name: user.name,
      email: user.email,
      cachedAt: new Date(),
    }));

    return await User.insertMany(usersToSave);
  } catch (error) {
    logger.error('Error in fetching users', error);
    throw error;
  }
};
