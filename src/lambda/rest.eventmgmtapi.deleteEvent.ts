import { api, errors } from '@taimos/cdk-serverless-v2/lib/lambda';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandler<operations['deleteEvent']>(async (ctx) => {
  ctx.logger.info(JSON.stringify(ctx.event));

  throw new errors.HttpError(500, 'Not yet implemented');
});