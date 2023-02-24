import { App, Stack, StackProps, pipelines } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationStage } from './stage';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName: 'event-system-backend',
      publishAssetsInParallel: false,
      crossAccountKeys: true,
      dockerEnabledForSynth: true,
      synth: new pipelines.CodeBuildStep('Synth', {
        input: pipelines.CodePipelineSource.connection('aws-community-dach/event-system-backend', 'main', {
          connectionArn: 'arn:aws:codestar-connections:eu-central-1:002630180209:connection/417c38ea-e616-4a2d-bb76-8f5284ad2bfe',
        }),
        installCommands: [
          'yarn install --frozen-lockfile',
        ],
        commands: [
          'npx projen build',
        ],
      }),
    });

    pipeline.addStage(new ApplicationStage(this, 'Dev', {
      env: {
        account: '574436697058',
        region: 'eu-central-1',
      },
      domainName: 'events-test.aws-community.de',
      stage: 'dev',
    }));

    // pipeline.addStage(new ApplicationStage(this, 'Prod', {
    //   env: {
    //     account: '',
    //     region: 'eu-central-1',
    //   },
    //   domainName: 'events.aws-community.de',
    //   stage: 'prod',
    // }));

  }
}

const app = new App();

new PipelineStack(app, 'event-system-backend-pipeline', {
  env: {
    account: '002630180209',
    region: 'eu-central-1',
  },
});

app.synth();