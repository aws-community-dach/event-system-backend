import { api, errors } from 'cdk-serverless/lib/lambda';
import { Participant, Event } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandler<operations['listEventParticipants']>(async (ctx) => {
  ctx.logger.info(JSON.stringify(ctx.event));

  ctx.auth.assertAdmin();

  const id = ctx.event.pathParameters!.eventId;
  const event = await Event.get({ id: id });
  if (!event) {
    throw new errors.NotFoundError();
  }

  const participants = await Participant.find({ eventId: id });

  return participants.map(participant => ({
    id: participant.participantId!,
    name: participant.name!,
    displayName: participant.displayName!,
    email: participant.email!,
    customData: JSON.parse(participant.customData!),
  }));
});
