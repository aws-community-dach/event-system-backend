import { PipelineApp } from './app';
import { ApplicationStack } from './app-stack';

new PipelineApp({
  provideDevStack(app, stackId, props) {
    return new ApplicationStack(app, stackId, {
      ...props,
      stackName: 'Dev-App',
      domainName: 'events-test.aws-community.de',
    });
  },
  provideProdStack(app, stackId, props) {
    return new ApplicationStack(app, stackId, {
      ...props,
      stackName: 'Prod-App',
      domainName: 'events.aws-community.de',
    });
  },
});
