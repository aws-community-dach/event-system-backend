import { api } from 'cdk-serverless/lib/lambda';
import { Event } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandlerWithRequestBody<operations['createEvent']>(async (ctx, data) => {
  ctx.logger.info(JSON.stringify(ctx.event));
  ctx.logger.info(JSON.stringify(data));

  ctx.auth.assertAdmin();

  const created = await Event.create({
    name: data.name!,
    date: new Date(data.date!),
    description: data.description,
    location: data.location,
  }, {
    exists: false,
  });

  return {
    id: created.id,
    name: created.name,
    description: created.description,
    location: created.location,
    date: created.date!.toISOString(),
  };
});