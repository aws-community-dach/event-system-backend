import { api, errors } from 'cdk-serverless/lib/lambda';
import { Event, Index_GSI1_Name } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandler<operations['getEventDetails']>(async (ctx) => {
  const id = ctx.event.pathParameters!.eventID;
  const event = await Event.get({ id }, { index: Index_GSI1_Name });
  if (!event) {
    throw new errors.NotFoundError();
  }

  return {
    id: event!.id!,
    name: event!.name!,
    description: event!.description!,
    date: event!.date?.toISOString(),
    location: event!.location!,
    // summary: '',
    // organizerID: '',
    // agenda: [],
  };
});