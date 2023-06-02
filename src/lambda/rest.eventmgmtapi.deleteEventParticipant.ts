import { api, errors } from 'cdk-serverless/lib/lambda';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';
import { Participant } from '../generated/datastore.event-model.generated';

export const handler = api.createOpenApiHandler<operations['deleteEventParticipant']>(async (ctx) => {
  ctx.logger.info(JSON.stringify(ctx.event));
  const participantId = ctx.event.pathParameters!.participantID;
  const eventId = ctx.event.pathParameters!.eventID;
  const token = ctx.event.pathParameters!.token;

  /*
  const event = await Event.get({id: eventId}, {index: Index_GSI1_Name});
  if (!event) {
    throw new errors.NotFoundError();
  }
  */
 
  // const participant = await Participant.get({PK: 'EVENT#' + eventId, SK: 'PARTICIPANT#' + participantId, token: token});
  const participant = await Participant.get({PK: 'EVENT#' + eventId, SK: 'PARTICIPANT#' + participantId});

  if(!participant) {
    throw new errors.NotFoundError();
  }
  
  try {
    if(token === participant.token){
      await Participant.remove({PK: 'EVENT#' + eventId, SK: 'PARTICIPANT#' + participantId});
    }
    return {
      statusCode: 204
    }
  } catch (error) {
    throw new errors.HttpError(500, 'Error deleting participant from event');
  }
});