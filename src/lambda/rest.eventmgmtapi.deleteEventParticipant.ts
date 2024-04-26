import { api, errors } from 'cdk-serverless/lib/lambda';
import { Participant } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandler<operations['deleteEventParticipant']>(async (ctx) => {
  ctx.logger.info(JSON.stringify(ctx.event));

  const eventId = ctx.event.pathParameters!.eventID;
  const participantId = ctx.event.pathParameters!.participantID;

  const participant = await Participant.get({ eventId: eventId, participantId: participantId });
  if (!participant || (participantId !== participant.participantId && !ctx.auth.isAdmin())) {
    throw new errors.NotFoundError();
  }

  await Participant.remove({ eventId: eventId, participantId: participantId });
});
