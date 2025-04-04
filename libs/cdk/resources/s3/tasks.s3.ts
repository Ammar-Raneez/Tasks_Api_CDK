import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';

import { BaseStackProps } from '../lib';

interface Props extends BaseStackProps {
  name: string;
}

export class TasksBucket {
  private bucket: Bucket;

  constructor(
    private readonly stack: Stack,
    private readonly props: Props,
  ) {
    this.initialize();
  }

  public get getBucket() {
    return this.bucket;
  }

  private initialize() {
    this.createBucket();
  }

  private createBucket() {
    this.bucket = new Bucket(this.stack, `ARSampleTasksBucket-${this.props.environment}`, {
      bucketName: this.props.name,
      removalPolicy: RemovalPolicy.RETAIN,
      publicReadAccess: false,
    });
  }
}
