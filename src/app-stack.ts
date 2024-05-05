import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PipelineAppStackProps } from './app';
import { EventDatastore } from './generated/datastore.event-construct.generated';
import { EventMgmtApiRestApi } from './generated/rest.eventmgmtapi-api.generated';


export interface ApplicationStackProps extends PipelineAppStackProps {
  readonly domainName: string;
}

export class ApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, private props: ApplicationStackProps) {
    super(scope, id, props);

    const singleTableDatastore = new EventDatastore(this, 'EventData', {});

    const api = new EventMgmtApiRestApi(this, 'Api', {
      stageName: props.stageName,
      domainName: props.domainName,
      apiHostname: 'api',
      singleTableDatastore,
      cors: true,
      additionalEnv: {
        DOMAIN_NAME: props.domainName,
      },
    });

    api.getFunctionForOperation('registerEventParticipant').grantSendEmails();

    this.createSesTemplate('confirm-registration', 'AWS Community DACH - Event registration');
  }

  private createSesTemplate(name: string, subject: string) {
    const layout = readFileSync(join(__dirname, '..', 'mail-templates', 'layout.html'), { encoding: 'utf-8' });
    const partFilename = join(__dirname, '..', 'mail-templates', `${name}.html`);
    const part = existsSync(partFilename) ? readFileSync(partFilename, { encoding: 'utf-8' }) : 'MISSING TEMPLATE';
    const htmlPart = layout.replace('%%CONTENTTEMPLATE%%', part);

    new cdk.aws_ses.CfnTemplate(this, `SesTemplate${name}`, {
      template: {
        templateName: `${this.props.stageName}-${name}`,
        subjectPart: (this.props.stageName !== 'prod' ? '[TESTSYSTEM]' : '') + subject,
        htmlPart,
      },
    });
  }
}