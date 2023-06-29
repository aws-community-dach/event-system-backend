import { api, errors } from 'cdk-serverless/lib/lambda';
import { Participant } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandlerWithRequestBody<operations['updateEventParticipant']>(async (ctx, data) => {
  ctx.logger.info(JSON.stringify(ctx.event));
  ctx.logger.info(JSON.stringify(data));

  const participantId = ctx.event.pathParameters!.participantID;
  const eventId = ctx.event.pathParameters!.eventID;
  const token = ctx.event.queryStringParameters!.token;

  const participant = await Participant.get({ eventId: eventId, email: participantId });
  if (!participant || (token !== participant.token && !ctx.auth.isAdmin())) {
    throw new errors.NotFoundError();
  }
  
  await Participant.update({
    eventId: eventId,
    email: participantId,
    name: data.name,
    displayName: data.displayName,
    customData: JSON.stringify(data.customData)
  })


  ctx.response.statusCode = 200;
});