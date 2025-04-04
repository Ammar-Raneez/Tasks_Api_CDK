import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { SSMParameters } from '../resources/ssm/parameters.ssm';

import { BaseStackProps } from '../resources/lib';

export class ConfigStack extends Stack {
  constructor(scope: Construct, id: string, props?: BaseStackProps) {
    super(scope, id, props);

    const environment = props?.environment || 'dev';

    new SSMParameters(this, {
      environment,
    });
  }
}
