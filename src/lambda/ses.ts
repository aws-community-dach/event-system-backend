import { env } from 'process';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const sesClient: SESv2Client = new SESv2Client({});

export const DATE_FMT_SHORT = 'dd.MM.yyyy';
export const DATE_FMT_LONG = 'dd.MM.yyyy HH:mm';

export async function sendEmail(to: string | string[], templateName: string, data: { [key: string]: any }, replyTo?: string[]) {
  try {
    const templateData = {
      ...data,
      websiteUrl: `https://www.${env.DOMAIN_NAME}`,
    };
    await sesClient.send(new SendEmailCommand({
      Content: {
        Template: {
          TemplateName: `${env.STAGE}-${templateName}`,
          TemplateData: JSON.stringify(templateData),
        },
      },
      ReplyToAddresses: replyTo,
      ConfigurationSetName: 'DEFAULT',
      FromEmailAddress: 'info@aws-community.de',
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
        BccAddresses: ['info+awscommunity@taimos.de'], // For Debugging
      },
    }));
  } catch (error) {
    console.log(error);
  }
}
