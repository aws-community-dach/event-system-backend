import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationStack } from './app-stack';
import { BaseStack } from './base-stack';

export interface ApplicationStageProps extends cdk.StageProps {
  readonly stage: string;
  readonly domainName: string;
}

export class ApplicationStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: ApplicationStageProps) {
    super(scope, id, props);

    const base = new BaseStack(this, 'Base', {
      stage: props.stage,
      domainName: props.domainName,
    });

    new ApplicationStack(this, 'App', {
      stage: props.stage,
      zone: base.hostedZone,
      domainName: props.domainName,
    });

  }
}