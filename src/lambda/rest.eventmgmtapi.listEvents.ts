import { api } from 'cdk-serverless/lib/lambda';
import { Event, Index_GSI1_Name } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandler<operations['listEvents']>(async (_ctx) => {
  const events = await Event.find({}, { index: Index_GSI1_Name });

  return events.map(e => ({
    id: e.id!,
    name: e.name!,
    date: e.date!.toISOString(),
    location: '',
    organizerID: '',
  }));
});