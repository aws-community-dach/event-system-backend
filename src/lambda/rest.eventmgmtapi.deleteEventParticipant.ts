import { api, errors } from 'cdk-serverless/lib/lambda';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';
import { Participant } from '../generated/datastore.event-model.generated';

export const handler = api.createOpenApiHandler<operations['deleteEventParticipant']>(async (ctx) => {
  ctx.logger.info(JSON.stringify(ctx.event));
  const participantId = ctx.event.pathParameters!.participantID;
  const eventId = ctx.event.pathParameters!.eventID;
  const token = ctx.event.queryStringParameters!.token;

  const participant = await Participant.get({ eventId: eventId, email: participantId });
  if (!participant) {
    throw new errors.NotFoundError();
  }

  if (token === participant.token) {
    await Participant.remove({ eventId: eventId, email: participantId });
    return {
      statusCode: 204
    }
  } else {
    throw new errors.HttpError(500, 'Error deleting participant from event');
  }

});