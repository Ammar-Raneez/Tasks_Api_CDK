import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export const s3CloudFrontPolicy = (
  accountId: string,
  bucketArn: string,
  distributionId: string,
) => {
  return new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['s3:GetObject'],
    resources: [`${bucketArn}/*`],
    principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
    conditions: {
      StringEquals: {
        'AWS:SourceArn': `arn:aws:cloudfront::${accountId}:distribution/${distributionId}`,
      },
    },
  });
};
