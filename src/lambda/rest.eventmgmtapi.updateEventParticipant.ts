import { api, errors } from 'cdk-serverless/lib/lambda';
import { Participant } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandlerWithRequestBody<operations['updateEventParticipant']>(async (ctx, data) => {
  ctx.logger.info(JSON.stringify(ctx.event));
  ctx.logger.info(JSON.stringify(data));

  const eventId = ctx.event.pathParameters!.eventID;
  const participantId = ctx.event.pathParameters!.participantId;

  const participant = await Participant.get({ eventId: eventId, participantId: participantId });
  if (!participant || (participantId !== participant.participantId && !ctx.auth.isAdmin())) {
    throw new errors.NotFoundError();
  }

  await Participant.update({
    eventId: eventId,
    email: participant.email,
    name: data.name,
    displayName: data.displayName,
    customData: JSON.stringify(data.customData),
  });

  return new Promise<never>(() => {});
});
