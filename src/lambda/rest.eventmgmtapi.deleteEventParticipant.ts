import { api, errors } from 'cdk-serverless/lib/lambda';
import { Participant } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandler<operations['deleteEventParticipant']>(async (ctx) => {
  ctx.logger.info(JSON.stringify(ctx.event));
  const participantId = ctx.event.pathParameters!.participantID;
  const eventId = ctx.event.pathParameters!.eventID;
  const token = ctx.event.queryStringParameters!.token;

  const participant = await Participant.get({ eventId: eventId, email: participantId });
  if (!participant || (token !== participant.token && !ctx.auth.isAdmin())) {
    throw new errors.NotFoundError();
  }

  await Participant.remove({ eventId: eventId, email: participantId });
});