#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import * as dotenv from 'dotenv';

import { ConfigStack } from '../lib/config.stack';
import { CommonResourcesStack } from '../lib/common-resources.stack';
import { ServerDeploymentStack } from '../lib/server.stack';

dotenv.config();
const environment = process.env.ENVIRONMENT || 'dev';

const app = new cdk.App();
new ConfigStack(app, `ARSampleConfig-${environment}`, {
  environment,
  env: { account: process.env.APP_ACCOUNT_ID, region: process.env.APP_REGION },
});

const commonResourcesStack = new CommonResourcesStack(app, `ARSampleCommonResourcesStack-${environment}`, {
  environment,
  env: { account: process.env.APP_ACCOUNT_ID, region: process.env.APP_REGION },
});

new ServerDeploymentStack(app, `ARSampleServerDeploymentStack-${environment}`, {
  environment,
  buckets: [commonResourcesStack.getTasksBucket],
});
