import { Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { TasksAppRunner } from '../resources/apprunner';
import { ECRPipeline } from '../resources/codebuild';
import { SSM } from '../resources/ssm';

import { BaseStackProps } from '../resources/lib';
import { Config } from '../src/interfaces';

interface ServerDeploymentStackProps extends BaseStackProps {
  buckets: Bucket[];
}

export class ServerDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: ServerDeploymentStackProps) {
    super(scope, id, props);

    const environment = props?.environment || 'dev';

    const config: Config = require(`../config/${environment}-config.json`);

    const { repoConnectionArnValue, dbUri, appPort, appVersion, cacheTtl, externalApi } = SSM(this);

    if (props && config.parameters) {
      const buildProject = new ECRPipeline(this, {
        environment,
        gitRepo: {
          ...config.parameters.gitRepo,
          connectionArn: repoConnectionArnValue,
        },
      });

      new TasksAppRunner(this, {
        environment,
        ecrRepository: buildProject.getECRRepository,
        buckets: props.buckets,
        serverPort: config.parameters.serverPort,
        appEnvVariables: {
          dbUri,
          appPort,
          appVersion,
          cacheTtl,
          externalApi,
        },
      });
    }
  }
}
