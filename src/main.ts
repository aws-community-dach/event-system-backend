import { App } from 'aws-cdk-lib';
import { ApplicationStage } from './stage';

const app = new App();

new ApplicationStage(app, 'Dev', {
  env: {
    account: '123456789012',
    region: 'eu-central-1',
  },
  domainName: 'events-test.aws-community.de',
  stage: 'dev',
});

app.synth();