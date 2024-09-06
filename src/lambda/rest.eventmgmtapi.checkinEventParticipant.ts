import { api, errors } from 'cdk-serverless/lib/lambda';
import { Participant } from '../generated/datastore.event-model.generated';
import { operations } from '../generated/rest.eventmgmtapi-model.generated';

export const handler = api.createOpenApiHandlerWithRequestBody<operations['checkinEventParticipant']>(async (ctx, data) => {
  ctx.logger.info(JSON.stringify(ctx.event));
  ctx.logger.info(JSON.stringify(data));

  const eventId = ctx.event.pathParameters!.eventId;
  const participantId = ctx.event.pathParameters!.participantId;

  if (data.token !== 'pwa') {
    throw new errors.ForbiddenError();
  }

  const participant = await Participant.get({ eventId: eventId, participantId: participantId });

  if (!participant) {
    throw new errors.NotFoundError();
  }

  const updated = await Participant.update({
    eventId: eventId,
    participantId: participantId,
    checkedIn: true,
  });

  return {
    id: updated.participantId!,
    name: updated.name!,
    displayName: updated.displayName!,
    email: updated.email!,
    customData: JSON.parse(updated.customData!),
    checkedIn: updated.checkedIn! ?? false,
  };
});