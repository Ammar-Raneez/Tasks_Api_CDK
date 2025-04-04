import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import dotenv from 'dotenv';

import { ENVIRONMENTS } from '../constants';

import { logger } from '../../utils';

dotenv.config();

const ajv = new Ajv({ allErrors: true });

ajvFormats(ajv);

const configSchema = {
  type: 'object',
  properties: {
    APP_ENV: {
      type: 'string',
      enum: [ENVIRONMENTS.DEV, ENVIRONMENTS.STAGING, ENVIRONMENTS.PRODUCTION],
    },
    APP_PORT: { type: 'string' },
    APP_VERSION: { type: 'string' },
    CACHE_TTL: { type: 'string' },
    EXTERNAL_API: { type: 'string' },
  },
  required: ['APP_ENV', 'APP_PORT', 'APP_VERSION', 'CACHE_TTL', 'EXTERNAL_API'],
};

const validate = ajv.compile(configSchema);

export const AppConfig = {
  APP_ENV: process.env.APP_ENV,
  APP_PORT: process.env.APP_PORT,
  APP_VERSION: process.env.APP_VERSION,
  CACHE_TTL: process.env.CACHE_TTL,
  EXTERNAL_API: process.env.EXTERNAL_API,
};

if (!validate(AppConfig)) {
  logger.error('Config validation failed:', validate.errors);
  const formattedErrors = validate.errors?.map((error) => `${error.instancePath} ${error.message}`);
  throw new Error(`Invalid configuration:\n${formattedErrors?.join('\n')}`);
}
