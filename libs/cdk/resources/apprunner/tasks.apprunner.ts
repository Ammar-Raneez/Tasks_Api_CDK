import { Stack } from 'aws-cdk-lib';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { IStringParameter } from 'aws-cdk-lib/aws-ssm';

import { Secret, Service, Source } from '@aws-cdk/aws-apprunner-alpha';

import { BaseStackProps } from '../lib';

interface Props extends BaseStackProps {
  ecrRepository: Repository;
  serverPort: number;
  appEnvVariables: {
    appPort: IStringParameter;
    appVersion: IStringParameter;
    cacheTtl: IStringParameter;
    dbUri: IStringParameter;
    externalApi: IStringParameter;
  };
  bucket: Bucket;
  distribution: Distribution;
}

export class TasksAppRunner {
  private role: Role;

  constructor(
    private readonly stack: Stack,
    private readonly props: Props,
  ) {
    this.initialize();
  }

  private initialize() {
    this.createService();
  }

  private createService() {
    const { appPort, appVersion, cacheTtl, dbUri, externalApi } = this.props.appEnvVariables;

    this.createInstanceRole();
    this.grantPermissions();

    new Service(this.stack, `ARSampleTasksAppRunner-${this.props.environment}`, {
      serviceName: `ARSampleTasksAppRunner-${this.props.environment}`,
      source: Source.fromEcr({
        imageConfiguration: {
          port: this.props.serverPort,
          environmentVariables: {
            APP_REGION: this.stack.region,
            APP_ENV: this.props.environment,
            APP_ACCOUNT_ID: this.stack.account,
            REGION: this.stack.region,
            BUCKET_NAME: this.props.bucket.bucketName,
            CLOUDFRONT_DISTRIBUTION: this.props.distribution.domainName,
          },
          environmentSecrets: {
            APP_PORT: Secret.fromSsmParameter(appPort),
            APP_VERSION: Secret.fromSsmParameter(appVersion),
            CACHE_TTL: Secret.fromSsmParameter(cacheTtl),
            DB_URI: Secret.fromSsmParameter(dbUri),
            EXTERNAL_API: Secret.fromSsmParameter(externalApi),
          },
        },
        repository: this.props.ecrRepository,
        tagOrDigest: 'latest',
      }),
      autoDeploymentsEnabled: true,
      instanceRole: this.role,
    });
  }

  private createInstanceRole() {
    this.role = new Role(this.stack, `ARSampleTasksAppRunnerBuildRole-${this.props.environment}`, {
      assumedBy: new ServicePrincipal('tasks.apprunner.amazonaws.com'),
    });
  }

  private grantPermissions() {
    Object.values(this.props.appEnvVariables).forEach((env) => {
      env?.grantRead(this.role);
    });

    this.props.bucket.grantReadWrite(this.role);
    this.props.bucket.grantPut(this.role);
  }
}
