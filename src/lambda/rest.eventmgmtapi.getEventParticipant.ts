import { api, errors } from 'cdk-serverless/lib/lambda';
import { Participant } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandler<operations['getEventParticipant']>(async (ctx) => {
  ctx.logger.info(JSON.stringify(ctx.event));

  const eventId = ctx.event.pathParameters!.eventId;
  const participantId = ctx.event.pathParameters!.participantId;

  const participant = await Participant.get({ eventId: eventId, participantId: participantId });
  if (!participant || (participantId !== participant.participantId && !ctx.auth.isAdmin())) {
    throw new errors.NotFoundError();
  }

  return {
    id: participant.participantId!,
    name: participant.name!,
    displayName: participant.displayName!,
    email: participant.email!,
    customData: JSON.parse(participant.customData!),
  };
});
