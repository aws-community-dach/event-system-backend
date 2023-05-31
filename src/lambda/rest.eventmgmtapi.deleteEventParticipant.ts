import { api, errors } from 'cdk-serverless/lib/lambda';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';
import { Event, Index_GSI1_Name, Participant } from '../generated/datastore.event-model.generated';

export const handler = api.createOpenApiHandler<operations['deleteEventParticipant']>(async (ctx) => {
  //ctx.logger.info(JSON.stringify(ctx.event));
  
  const eventId = ctx.event.pathParameters!.eventID;
  const event = await Event.get({id: eventId}, {index: Index_GSI1_Name});
  if (!event) {
    throw new errors.NotFoundError();
  }

  const participantId = ctx.event.pathParameters!.participantID;
  const participant = await Participant.get({ token: participantId }, {index: Index_GSI1_Name}); 

  if(!participant) {
    throw new errors.NotFoundError();
  }
  
  try {
    if(participant.eventId === eventId){
      await Participant.remove({ token: participantId }, {index: Index_GSI1_Name});
      return {
        statusCode: 204
      };
    }
       
  } catch (error) {
    throw new errors.HttpError(500, 'Error deleting participant from event');
  }
});