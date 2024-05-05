import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';

// CURRENTLY NOT DEPLOYED AUTOMATICALLY

export interface BaseStackProps extends cdk.StackProps {
  readonly stage: string;
  readonly domainName: string;
}

export class BaseStack extends cdk.Stack {

  public readonly hostedZone: cdk.aws_route53.HostedZone;

  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    this.hostedZone = new cdk.aws_route53.HostedZone(this, 'Zone', {
      zoneName: props.domainName,
      comment: `Main DNS zone for stage ${props.stage}`,
    });

    new CfnOutput(this, 'NameServers', { value: Fn.join(',', this.hostedZone.hostedZoneNameServers!) });

  }
}