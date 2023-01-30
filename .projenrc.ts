import { RestApi, ServerlessProject } from '@taimos/cdk-serverless-v2/lib/projen';

const project = new ServerlessProject({
  cdkVersion: '2.60.0',
  defaultReleaseBranch: 'main',
  name: 'event-system-backend',
  deps: [
    'projen',
    '@taimos/cdk-serverless-v2',
    'date-fns',
  ],
});

new RestApi(project, {
  apiName: 'RegistrationApi',
  definitionFile: './src/definitions/registration-api.yaml',
});

project.synth();