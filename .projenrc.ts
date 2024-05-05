import { RestApi, ServerlessProject, Datastore } from 'cdk-serverless/lib/projen';
import { GithubCDKPipeline } from 'projen-pipelines';

const project = new ServerlessProject({
  cdkVersion: '2.137.0',
  cdkVersionPinning: true,
  defaultReleaseBranch: 'main',
  name: 'event-system-backend',
  constructsVersion: '10.3.0',
  deps: [
    'projen',
    'projen-pipelines',
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
project.package.addPackageResolutions('projen@0.81.4');

project.npmrc.addRegistry('https://npm.pkg.github.com', '@aws-community-dach-assembly');
project.npmrc.addConfig('//npm.pkg.github.com/:_authToken', '${GITHUB_TOKEN}');
project.npmrc.addConfig('//npm.pkg.github.com/:always-auth', 'true');

new GithubCDKPipeline(project, {
  iamRoleArns: {
    default: 'arn:aws:iam::002630180209:role/GitHub-event-system',
  },
  pkgNamespace: '@aws-community-dach-assembly',
  preInstallCommands: ['echo "GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }}" >> $GITHUB_ENV'],
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
    manualApproval: true,
  }],
});

project.synth();