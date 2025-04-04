import { Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { TasksBucket } from '../resources/s3';
import { TasksDistribution } from '../resources/cloudfront';

import { BaseStackProps } from '../resources/lib';

export class CommonResourcesStack extends Stack {
  private tasksBucket: Bucket;

  constructor(scope: Construct, id: string, props?: BaseStackProps) {
    super(scope, id, props);

    const environment = props?.environment || 'dev';

    const pb = new TasksBucket(this, {
      environment,
      name: `ar-sample-tasks-${environment}`,
    });

    this.tasksBucket = pb.getBucket;

    new TasksDistribution(this, {
      environment,
      bucket: pb.getBucket,
    });
  }

  public get getTasksBucket() {
    return this.tasksBucket;
  }
}
