import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import dotenv from 'dotenv';

import { logger } from '../../utils';

dotenv.config();

const ajv = new Ajv({ allErrors: true });

ajvFormats(ajv);

const configSchema = {
  type: 'object',
  properties: {
    DB_URI: { type: 'string' },
  },
  required: ['DB_URI'],
};

const validate = ajv.compile(configSchema);

export const DBConfig = {
  DB_URI: process.env.DB_URI || '',
};

if (!validate(DBConfig)) {
  logger.error('Config validation failed:', validate.errors);
  const formattedErrors = validate.errors?.map((error) => `${error.instancePath} ${error.message}`);
  throw new Error(`Invalid configuration:\n${formattedErrors?.join('\n')}`);
}
