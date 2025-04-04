import { Stack } from 'aws-cdk-lib';

import { generateSSMParameter } from './ssm';

import { BaseStackProps } from '../lib';

import { Config } from '../../src/interfaces';

interface Props extends BaseStackProps { }

export class SSMParameters {
  constructor(
    private readonly stack: Stack,
    private readonly props: Props,
  ) {
    this.initialize();
  }

  private initialize() {
    this.createParameters();
  }

  private createParameters() {
    const config: Config = require(`../../config/${this.props.environment}-config.json`);

    const APP_PORT = process.env.APP_PORT;
    const APP_VERSION = process.env.APP_VERSION;
    const CACHE_TTL = process.env.CACHE_TTL;
    const EXTERNAL_API = process.env.EXTERNAL_API;
    const DB_URI = process.env.DB_URI;

    if (APP_PORT) {
      generateSSMParameter(this.stack, config.parameters.application.APP_PORT, APP_PORT);
    }

    if (APP_VERSION) {
      generateSSMParameter(this.stack, config.parameters.application.APP_VERSION, APP_VERSION);
    }

    if (CACHE_TTL) {
      generateSSMParameter(this.stack, config.parameters.application.CACHE_TTL, CACHE_TTL);
    }

    if (EXTERNAL_API) {
      generateSSMParameter(this.stack, config.parameters.application.EXTERNAL_API, EXTERNAL_API);
    }

    if (DB_URI) {
      generateSSMParameter(this.stack, config.parameters.database.DB_URI, DB_URI);
    }
  }
}
