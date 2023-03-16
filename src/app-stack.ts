import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EventDatastore } from './generated/datastore.event-construct.generated';
import { EventMgmtApiRestApi } from './generated/rest.eventmgmtapi-api.generated';


export interface ApplicationStackProps extends cdk.StackProps {
  readonly stage: string;
  readonly domainName: string;
  readonly zone: cdk.aws_route53.IHostedZone;
}

export class ApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationStackProps) {
    super(scope, id, props);

    const singleTableDatastore = new EventDatastore(this, 'EventData', {});

    new EventMgmtApiRestApi(this, 'Api', {
      stageName: props.stage,
      domainName: props.domainName,
      apiHostname: 'api',
      singleTableDatastore,
    });

  }
}