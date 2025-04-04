import { Stack } from 'aws-cdk-lib';
import { BuildSpec, LinuxBuildImage, PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import {
  CodeBuildAction,
  CodeStarConnectionsSourceAction,
} from 'aws-cdk-lib/aws-codepipeline-actions';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

import { BaseStackProps } from '../lib';

interface Props extends BaseStackProps {
  gitRepo: {
    owner: string;
    name: string;
    branch: string;
    connectionArn: string;
  };
}

export class ECRPipeline {
  private ecrRepository: Repository;

  private sourceAction: CodeStarConnectionsSourceAction;
  private buildAction: CodeBuildAction;
  private pipelineProject: PipelineProject;

  private sourceOutput = new Artifact();
  private buildOutput = new Artifact();

  constructor(
    private readonly stack: Stack,
    private readonly props: Props,
  ) {
    this.initialize();
  }

  public get getECRRepository() {
    return this.ecrRepository;
  }

  private initialize() {
    this.createECRRepository();
    this.createDeploymentPipeline();
  }

  private createECRRepository() {
    const repositoryName = `ar-sample-tasks-repository-${this.props.environment}`;

    this.ecrRepository = new Repository(this.stack, `ARSampleTasksECR-${this.props.environment}`, {
      repositoryName,
    });

    // Remove outdated images
    this.ecrRepository.addLifecycleRule({
      rulePriority: 1,
      description: 'Retain only the latest image',
      maxImageCount: 1,
    });
  }

  private createDeploymentPipeline() {
    this.createSourceAction();
    this.createPipelineProject();
    this.createBuildAction();
    this.createBuildPipeline();
    this.grantAppRunnerPullAccess();
  }

  private createSourceAction() {
    this.sourceAction = new CodeStarConnectionsSourceAction({
      actionName: 'GitHub_Source',
      owner: this.props.gitRepo.owner,
      repo: this.props.gitRepo.name,
      branch: this.props.gitRepo.branch,
      connectionArn: this.props.gitRepo.connectionArn,
      output: this.sourceOutput,
    });
  }

  private createPipelineProject() {
    this.pipelineProject = new PipelineProject(
      this.stack,
      `ARSampleTasksBuild-${this.props.environment}`,
      {
        role: this.createBuildProjectRole(),
        environment: {
          buildImage: LinuxBuildImage.AMAZON_LINUX_2_5,
          privileged: true,
        },
        environmentVariables: {
          REPOSITORY_URI: {
            value: this.ecrRepository.repositoryUri,
          },
          AWS_REGION: {
            value: this.stack.region,
          },
          AWS_ACCOUNT_ID: {
            value: this.stack.account,
          },
          ECR_ENVIRONMENT: {
            value: this.props.environment,
          },
        },

        buildSpec: BuildSpec.fromObject({
          version: '0.2',
          phases: {
            pre_build: {
              commands: [
                'echo Logging in to Amazon ECR...',
                'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $REPOSITORY_URI',
              ],
            },
            build: {
              commands: [
                'echo Building the Docker image on date',
                'docker build -f Dockerfile --build-arg ECR_ENVIRONMENT=$ECR_ENVIRONMENT -t $REPOSITORY_URI:latest .',
              ],
            },
            post_build: {
              commands: [
                'echo Pushing the Docker image to ECR...',
                'docker push $REPOSITORY_URI:latest',
              ],
            },
          },
        }),
      },
    );
  }

  private createBuildAction() {
    this.buildAction = new CodeBuildAction({
      actionName: `ARSampleCodebuild-${this.props.environment}`,
      project: this.pipelineProject,
      input: this.sourceOutput,
      outputs: [this.buildOutput],
    });
  }

  private createBuildPipeline() {
    new Pipeline(this.stack, `ARSampleTasksPipeline-${this.props.environment}`, {
      pipelineName: `ARSampleTasksServer-${this.props.environment}`,
      stages: [
        {
          stageName: 'Source',
          actions: [this.sourceAction],
        },
        {
          stageName: 'Build',
          actions: [this.buildAction],
        },
      ],
    });
  }

  private grantAppRunnerPullAccess() {
    const ecrPullPermission = new Role(
      this.stack,
      `ARSampleTasksTasksRole-${this.props.environment}`,
      {
        assumedBy: new ServicePrincipal('tasks.apprunner.amazonaws.com'),
      },
    );

    this.ecrRepository.grantPullPush(ecrPullPermission);
  }

  private createBuildProjectRole() {
    const buildProjectRole = new Role(
      this.stack,
      `ARSampleTasksBuildRole-${this.props.environment}`,
      {
        assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
      },
    );

    buildProjectRole.addToPolicy(
      new PolicyStatement({
        actions: [
          'ecr:GetDownloadUrlForLayer',
          'ecr:BatchGetImage',
          'ecr:GetAuthorizationToken',
          'ecr:BatchCheckLayerAvailability',
          'ecr:PutImage',
          'ecr:CompleteLayerUpload',
          'ecr:InitiateLayerUpload',
          'ecr:UploadLayerPart',
        ],
        resources: ['*'],
      }),
    );

    return buildProjectRole;
  }
}
