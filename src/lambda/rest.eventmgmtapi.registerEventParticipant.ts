import { api, errors } from 'cdk-serverless/lib/lambda';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { DATE_FMT_SHORT, sendEmail } from './ses';
import { Event, Index_GSI1_Name, Participant } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandlerWithRequestBody<operations['registerEventParticipant']>(async (ctx, data) => {
  ctx.logger.info(JSON.stringify(ctx.event));
  ctx.logger.info(JSON.stringify(data));

  const eventId = ctx.event.pathParameters!.eventId;
  const event = await Event.get({ id: eventId }, { index: Index_GSI1_Name });
  if (!event) {
    throw new errors.NotFoundError();
  }

  const participant = await Participant.create({
    eventId,
    confirmed: true,
    email: data.email,
    name: data.name,
    displayName: data.displayName,
    customData: JSON.stringify(data.customData ?? {}),
  }, {
    exists: false,
  });
  console.log(participant);

  await sendEmail(data.email!, 'confirm-registration', {
    event,
    participant,
    datePretty: format(event.date!, DATE_FMT_SHORT, { locale: de }),
  });

  ctx.response.statusCode = 201;
  ctx.response.headers.Location = `/events/${eventId}/participants/${data.email}`;
});
