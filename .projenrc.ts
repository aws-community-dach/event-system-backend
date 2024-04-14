import { RestApi, ServerlessProject, Datastore } from 'cdk-serverless/lib/projen';

const project = new ServerlessProject({
  cdkVersion: '2.137.0',
  cdkVersionPinning: true,
  defaultReleaseBranch: 'main',
  name: 'event-system-backend',
  constructsVersion: '10.3.0',
  deps: [
    'projen',
    'cdk-serverless',
    'date-fns',
    '@aws-sdk/client-sesv2',
    '@aws-cdk/aws-cognito-identitypool-alpha',
  ],
});

new RestApi(project, {
  apiName: 'EventMgmtApi',
  definitionFile: './src/definitions/event-management-api.yaml',
});

new Datastore(project, {
  modelName: 'Event',
  definitionFile: './src/definitions/event-datamodel.json',
});

project.package.addPackageResolutions('constructs@10.3.0');

project.synth();