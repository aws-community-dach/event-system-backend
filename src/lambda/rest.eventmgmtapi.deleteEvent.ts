import { api, errors } from 'cdk-serverless/lib/lambda';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';
import { Event, Index_GSI1_Name } from '../generated/datastore.event-model.generated';

export const handler = api.createOpenApiHandler<operations['deleteEvent']>(async (ctx) => {
  ctx.logger.info(JSON.stringify(ctx.event));

  ctx.auth.assertAdmin();

  const id = ctx.event.pathParameters!.eventID;
  const event = await Event.get({ id }, { index: Index_GSI1_Name });
  if (!event) {
    throw new errors.NotFoundError();
  }else{
    await Event.remove({ id }, { index: Index_GSI1_Name });
    return {
      statusCode: 204
    }
  }
});