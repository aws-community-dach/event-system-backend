import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationStack, ApplicationStackSettings } from './stack';

export interface ApplicationStageProps extends cdk.StageProps, ApplicationStackSettings {
  //
}

export class ApplicationStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: ApplicationStageProps) {
    super(scope, id, props);

    new ApplicationStack(this, 'App', {
      stage: props.stage,
      domainName: props.domainName,
    });

  }
}