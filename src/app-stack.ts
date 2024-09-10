import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import * as cdk from 'aws-cdk-lib';
import { CognitoAuthentication, LambdaFunction } from 'cdk-serverless/lib/constructs';
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

    const authentication = new CognitoAuthentication(this, 'CognitoAuth', {
      userPoolName: `EventMgmtUserPool-${props.stageName}`,
      groups: { admin: 'Admins' },
      triggers: {
        customMessages: true,
        preTokenGeneration: true,
      },
      sesEmailSender: {
        email: 'info@aws-community.de',
        name: 'AWS Community DACH',
        region: 'eu-central-1',
      },
      userPoolProps: {
        autoVerify: {
          email: false,
          phone: false,
        },
        selfSignUpEnabled: true,
      },
    });
    authentication.preTokenGenerationFunction!.setTable(singleTableDatastore.table);

    const api = new EventMgmtApiRestApi(this, 'Api', {
      stageName: props.stageName,
      domainName: props.domainName,
      apiHostname: 'api',
      singleTableDatastore,
      authentication,
      cors: true,
      additionalEnv: {
        DOMAIN_NAME: props.domainName,
        MAIL_COPY: 'true',
      },
    });

    api.getFunctionForOperation('registerEventParticipant').grantSendEmails();

    this.createSesTemplate('confirm-registration', 'AWS Community DACH - Event registration');
    this.createSesTemplate('reminder', 'AWS Community DACH - Event reminder');
    this.createSesTemplate('checkin', 'AWS Community DACH - Event check-in');

    const cognitoClientWebsite = authentication.userpool.addClient('UserPoolClientWebsite', {
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });
    new cdk.CfnOutput(this, 'UserPoolClientWebsiteId', { value: cognitoClientWebsite.userPoolClientId });


    new LambdaFunction(this, 'ReminderEmail', {
      stageName: props.stageName,
      entry: './src/lambda/manual.reminder.ts',
      table: singleTableDatastore.table,
      additionalEnv: {
        DOMAIN_NAME: props.domainName,
      },
      lambdaOptions: {
        timeout: cdk.Duration.minutes(10),
      },
    }).grantSendEmails();
    new LambdaFunction(this, 'CheckinEmail', {
      stageName: props.stageName,
      entry: './src/lambda/manual.checkin.ts',
      table: singleTableDatastore.table,
      additionalEnv: {
        DOMAIN_NAME: props.domainName,
      },
      lambdaOptions: {
        timeout: cdk.Duration.minutes(10),
      },
    }).grantSendEmails();
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