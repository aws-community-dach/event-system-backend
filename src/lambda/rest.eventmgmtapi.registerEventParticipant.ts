import { api, errors } from 'cdk-serverless/lib/lambda';
import { Event, Index_GSI1_Name, Participant } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandlerWithRequestBody<operations['registerEventParticipant']>(async (ctx, data) => {
  ctx.logger.info(JSON.stringify(ctx.event));
  ctx.logger.info(JSON.stringify(data));

  const id = ctx.event.pathParameters!.eventID;
  const event = await Event.get({ id }, { index: Index_GSI1_Name });
  if (!event) {
    throw new errors.NotFoundError();
  }

  const participant = await Participant.create({
    eventId: id,
    confirmed: false,
    email: data.email,
    name: data.name,
    displayName: data.displayName,
  }, {
    exists: false,
  });
  console.log(participant);

  // TODO send email for confirmation

  ctx.response.statusCode = 201;
  ctx.response.headers.Location = `/events/${id}/participants/${data.email}`;
});