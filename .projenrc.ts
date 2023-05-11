import { RestApi, ServerlessProject, Datastore } from 'cdk-serverless/lib/projen';

const project = new ServerlessProject({
  cdkVersion: '2.60.0',
  defaultReleaseBranch: 'main',
  name: 'event-system-backend',
  deps: [
    'projen',
    'cdk-serverless',
    'date-fns',
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

project.synth();