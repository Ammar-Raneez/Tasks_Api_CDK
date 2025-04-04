import { StackProps } from 'aws-cdk-lib';

export interface BaseStackProps extends StackProps {
  environment: string;
}

