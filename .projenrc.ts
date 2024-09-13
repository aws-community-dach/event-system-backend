import { RestApi, ServerlessProject, Datastore } from 'cdk-serverless/lib/projen';
import { NodePackageManager } from 'projen/lib/javascript';
import { GithubCDKPipeline } from 'projen-pipelines';

const project = new ServerlessProject({
  cdkVersion: '2.152.0',
  cdkVersionPinning: true,
  defaultReleaseBranch: 'main',
  name: 'event-system-backend',
  packageManager: NodePackageManager.NPM,
  constructsVersion: '10.3.0',
  devDeps: [
    'projen',
    'projen-pipelines',
  ],
  deps: [
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

project.package.addPackageResolutions('constructs@^10.3.0');
project.package.addPackageResolutions('@aws-cdk/aws-cognito-identitypool-alpha@2.152.0-alpha.0');

project.addTask('test:integ', {
  exec: 'npx jest -u --testMatch=\'**/test/integ/*.e2e.ts\'',
  receiveArgs: true,
});

new GithubCDKPipeline(project, {
  iamRoleArns: {
    default: 'arn:aws:iam::002630180209:role/GitHub-event-system',
  },
  pkgNamespace: '@aws-community-dach',
  useGithubPackagesForAssembly: true,
  useGithubEnvironments: true,
  stages: [{
    env: {
      account: '574436697058',
      region: 'eu-central-1',
    },
    name: 'dev',
  }, {
    env: {
      account: '451567866306',
      region: 'eu-central-1',
    },
    name: 'prod',
  }],
});

project.synth();