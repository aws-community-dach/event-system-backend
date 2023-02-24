import { http, errors } from '@taimos/lambda-toolbox';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = http.createOpenApiHandler<operations['deleteEvent']>(async (ctx) => {
  ctx.logger.info(JSON.stringify(ctx.event));

  throw new errors.HttpError(500, 'Not yet implemented');
});