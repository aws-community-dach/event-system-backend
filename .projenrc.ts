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
  apiName: 'EventMgmtApi',
  definitionFile: './src/definitions/event-management-api.yaml',
});

project.synth();