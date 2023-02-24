import { http, errors } from '@taimos/lambda-toolbox';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = http.createOpenApiHandlerWithRequestBody<operations['registerEventParticipant']>(async (ctx, data) => {
  ctx.logger.info(JSON.stringify(ctx.event));
  ctx.logger.info(JSON.stringify(data));
  throw new errors.HttpError(500, 'Not yet implemented');
});