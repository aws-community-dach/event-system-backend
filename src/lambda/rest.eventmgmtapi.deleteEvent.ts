import { api, errors } from 'cdk-serverless/lib/lambda';
import { Event, Participant } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';


export const handler = api.createOpenApiHandler<operations['deleteEvent']>(async (ctx) => {
  ctx.logger.info(JSON.stringify(ctx.event));

  ctx.auth.assertAdmin();

  const id = ctx.event.pathParameters!.eventID;
  const participants = await Participant.find({eventId: id})
  if(participants.length > 0){
    throw new errors.ForbiddenError();
  }
  const event = await Event.get({ id });
  if (!event) {
    throw new errors.NotFoundError();
  }
  await Event.remove({ id });
  return;

});