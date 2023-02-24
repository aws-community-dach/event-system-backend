import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RegistrationApiRestApi } from './generated/rest.registrationapi-api.generated';


export interface ApplicationStackProps extends cdk.StackProps {
  readonly stage: string;
  readonly domainName: string;
  readonly zone: cdk.aws_route53.IHostedZone;
}

export class ApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationStackProps) {
    super(scope, id, props);

    new RegistrationApiRestApi(this, 'RegistrationApi', {
      stageName: props.stage,
      domainName: props.domainName,
      apiHostname: 'api',
    });

  }
}