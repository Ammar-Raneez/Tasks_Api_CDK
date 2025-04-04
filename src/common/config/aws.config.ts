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
    REGION: { type: 'string' },
    BUCKET_NAME: { type: 'string' },
    CLOUDFRONT_DISTRIBUTION: { type: 'string' },
  },
  required: ['REGION', 'BUCKET_NAME', 'CLOUDFRONT_DISTRIBUTION'],
};

const validate = ajv.compile(configSchema);

export const AWSConfig = {
  REGION: process.env.REGION,
  BUCKET_NAME: process.env.BUCKET_NAME,
  CLOUDFRONT_DISTRIBUTION: process.env.CLOUDFRONT_DISTRIBUTION,
};

if (!validate(AWSConfig)) {
  logger.error('Config validation failed:', validate.errors);
  const formattedErrors = validate.errors?.map((error) => `${error.instancePath} ${error.message}`);
  throw new Error(`Invalid configuration:\n${formattedErrors?.join('\n')}`);
}
