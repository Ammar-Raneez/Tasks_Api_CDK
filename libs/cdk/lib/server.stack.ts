import { Stack } from 'aws-cdk-lib';
import { Config } from '../src/interfaces';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { TasksAppRunner } from '../resources/apprunner';
import { ECRPipeline } from '../resources/codebuild';
import { SSM } from '../resources/ssm';

import { BaseStackProps } from '../resources/lib';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';

interface ServerDeploymentStackProps extends BaseStackProps {
  bucket: Bucket;
  distribution: Distribution;
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
        bucket: props.bucket,
        distribution: props.distribution,
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
