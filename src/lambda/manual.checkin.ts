import { errors } from 'cdk-serverless/lib/lambda';
import { sendEmail } from './ses';
import { Event, Participant } from '../generated/datastore.event-model.generated';

interface ReminderInfo {
  eventId: string;
}

export const handler = async ({ eventId }: ReminderInfo) => {
  const event = await Event.get({ id: eventId });
  if (!event) {
    throw new errors.NotFoundError();
  }

  const participants = await Participant.find({
    eventId,
  });
  console.log(participants.length);

  for (const participant of participants) {
    try {
      await sendEmail(participant.email!, 'checkin', {
        event,
        participant,
      });
    } catch (error) {
      console.log(error);
      console.log(`Failed to send checkin email to ${participant.email}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};
