import { logger } from './winston.utils';

export function ThrowError(error: any) {
  logger.error(error.toString());
  return error;
}
