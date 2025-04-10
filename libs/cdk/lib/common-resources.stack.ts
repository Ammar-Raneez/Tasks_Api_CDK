import { Stack } from 'aws-cdk-lib';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { TasksBucket } from '../resources/s3';
import { TasksDistribution } from '../resources/cloudfront';

import { BaseStackProps } from '../resources/lib';

export class CommonResourcesStack extends Stack {
  private tasksBucket: Bucket;
  private distribution: Distribution;

  constructor(scope: Construct, id: string, props?: BaseStackProps) {
    super(scope, id, props);

    const environment = props?.environment || 'dev';

    const pb = new TasksBucket(this, {
      environment,
      name: `ar-sample-tasks-${environment}`,
    });

    this.tasksBucket = pb.getBucket;

    const dist = new TasksDistribution(this, {
      environment,
      bucket: pb.getBucket,
    });

    this.distribution = dist.getDistribution;
  }

  public get getTasksBucket() {
    return this.tasksBucket;
  }

  public get getDistribution() {
    return this.distribution;
  }
}
