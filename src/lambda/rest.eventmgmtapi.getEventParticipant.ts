import { api, errors } from 'cdk-serverless/lib/lambda';
import { Participant } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandler<operations['getEventParticipant']>(async (ctx) => {
  ctx.logger.info(JSON.stringify(ctx.event));

  const participantId = decodeURIComponent(ctx.event.pathParameters!.participantID!); // id is an e-mail address and thus encoded
  const eventId = ctx.event.pathParameters!.eventID;
  const token = ctx.event.queryStringParameters!.token;

  const participant = await Participant.get({ eventId: eventId, email: participantId });
  if (!participant || (token !== participant.token && !ctx.auth.isAdmin())) {
    throw new errors.NotFoundError();
  }

  return {
    id: participant.eventId!,
    name: participant.name!,
    displayName: participant.displayName!,
    email: participant.email!,
    customData: JSON.parse(participant.customData!),
  };
});