import { Stack } from 'aws-cdk-lib';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

import { Config } from '../../src/interfaces';

export const SSM = (stack: Stack) => {
  const environment = process.env.ENVIRONMENT || 'dev';
  const config: Config = require(`../../config/${environment}-config.json`);

  const repoConnectionArnValue = StringParameter.fromStringParameterAttributes(
    stack,
    `ARSampleRepoConnectionParameter-${environment}`,
    {
      parameterName: config.parameters.gitRepo.connectionArn,
    },
  ).stringValue;

  const dbUri = StringParameter.fromStringParameterAttributes(
    stack,
    `ARSampleDbUriParameter-${environment}`,
    {
      parameterName: config.parameters.database.DB_URI,
    },
  );

  const appPort = StringParameter.fromStringParameterAttributes(
    stack,
    `ARSampleAppPortParameter-${environment}`,
    {
      parameterName: config.parameters.application.APP_PORT,
    },
  );

  const appVersion = StringParameter.fromStringParameterAttributes(
    stack,
    `ARSampleAppVersionParameter-${environment}`,
    {
      parameterName: config.parameters.application.APP_VERSION,
    },
  );

  const cacheTtl = StringParameter.fromStringParameterAttributes(
    stack,
    `ARSampleCacheTTLParameter-${environment}`,
    {
      parameterName: config.parameters.application.CACHE_TTL,
    },
  );

  const externalApi = StringParameter.fromStringParameterAttributes(
    stack,
    `ARSampleExternalApiParameter-${environment}`,
    {
      parameterName: config.parameters.application.EXTERNAL_API,
    },
  );

  return {
    repoConnectionArnValue,
    dbUri,
    appPort,
    appVersion,
    cacheTtl,
    externalApi,
  };
};

export const generateSSMParameter = (stack: Stack, key: string, value: string) => {
  const ssmParameter = new StringParameter(stack, key, {
    parameterName: key,
    stringValue: value,
  });

  return ssmParameter;
};
