import { IntegTestUtil } from 'cdk-serverless/lib/tests';
import { HttpStatusCode } from 'axios';
import { Event, Participant } from '../../src/generated/datastore.event-model.generated';
import exp from 'constants';

const integUtil = new IntegTestUtil({
  region: 'eu-central-1',
  apiOptions: {
    baseURL: 'https://api.events-test.aws-community.de',
  },
  datastoreOptions: {
    tableName: 'Dev-App-EventData1BF73A70-WL8SVRQO2555',
  },
  authOptions: {
    userPoolClientId: '5un6m6js1bf7s2fiqc2gufoi9g',
    userPoolId: 'eu-central-1_uqptxBiuI',
  }
});

const adminUserName = `info+integ${new Date().getTime()}@taimos.de`;

beforeAll(async () => {
  await integUtil.createUser(adminUserName,{},['admin']);
});

afterAll(async () => {
  await integUtil.removeUser(adminUserName);
});

beforeEach(async () => {
  await integUtil.initializeItemsToCleanup()
});

afterEach(async () => {
  await integUtil.cleanupItems();
})

test('retrieve list of all participants for an event', async() =>{
  const client = await integUtil.getAuthenticatedClient(adminUserName);
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const participant = await Participant.create({
    eventId: entity.id,
    name: 'Max Mustermann',
    displayName: 'Max',
    email: `info+${new Date().getTime()}@taimos.de`,
    confirmed: true
  })
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const getListOfParticipants =  await client.get(`/events/${entity.id}/participants`);
  expect(getListOfParticipants.status).toEqual(HttpStatusCode.Ok);
  expect(getListOfParticipants.data.lenght).toBe(1);
  expect(getListOfParticipants.data[0].name).toEqual(participant.name);
  expect(getListOfParticipants.data[0].displayName).toEqual(participant.displayName);
  expect(getListOfParticipants.data[0].email).toEqual(participant.email);
  expect(getListOfParticipants.data[0].confirmed).toEqual(participant.confirmed);
})

test('retrieve a participant for an event', async() => {
  const client = await integUtil.getAuthenticatedClient(adminUserName);
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const participant = await Participant.create({
    eventId: entity.id,
    name: 'Max Mustermann',
    displayName: 'Max',
    email: `info+${new Date().getTime()}@taimos.de`,
    confirmed: true
  })
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const getParticipant =  await client.get(`/events/${entity.id}/participants/${participant.participantId}`);
  expect(getParticipant.status).toEqual(HttpStatusCode.Ok);
  expect(getParticipant.data.name).toEqual(participant.name);
  expect(getParticipant.data.displayName).toEqual(participant.displayName);
  expect(getParticipant.data.email).toEqual(participant.email);
  expect(getParticipant.data.confirmed).toEqual(participant.confirmed);
})

test('retrieve a participant for an event unauthorized', async() => {
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const participant = await Participant.create({
    eventId: entity.id,
    name: 'Max Mustermann',
    displayName: 'Max',
    email: `info+${new Date().getTime()}@taimos.de`,
    confirmed: true
  })
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const getParticipantUnauthorized = await integUtil.getClient().get(`/events/${entity.id}/participants/${participant.participantId}`);
  expect(getParticipantUnauthorized.status).toEqual(HttpStatusCode.Unauthorized);
})

test('retrieve a participant for an event unauthorized as owner', async() => {
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const emailParticipant = `info+${new Date().getTime()}@taimos.de`
  const participant = await Participant.create({
    eventId: entity.id,
    name: 'Max Mustermann',
    displayName: 'Max',
    email: emailParticipant,
    confirmed: true
  })
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const getParticipantUnauthorized = await integUtil.getClient().get(`/events/${entity.id}/participants/${participant.participantId}?email=${participant.email}`);
  expect(getParticipantUnauthorized.status).toEqual(HttpStatusCode.Ok);
  expect(getParticipantUnauthorized.data.eventId).toEqual(entity.id);
  expect(getParticipantUnauthorized.data.name).toEqual(participant.name);
  expect(getParticipantUnauthorized.data.displayName).toEqual(participant.displayName);
  expect(getParticipantUnauthorized.data.email).toEqual(participant.email);
})

test('retrieve list of all participants for an event unauthorized', async() => {
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const participant = await Participant.create({
    eventId: entity.id,
    name: 'Max Mustermann',
    displayName: 'Max',
    email: `info+${new Date().getTime()}@taimos.de`,
    confirmed: true
  })
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const getParticipantUnauthorized = await integUtil.getClient().get(`/events/${entity.id}/participants`);
  expect(getParticipantUnauthorized.status).toEqual(HttpStatusCode.Unauthorized);
})

test('post participant for specific event', async() => {
  const client = await integUtil.getAuthenticatedClient(adminUserName);
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const emailParticipant = `info+${new Date().getTime()}@taimos.de`
  const postParticipant = await client.post(`/events/${entity.id}/participants`,
    {
      name: 'Max Mustermann',
      displayName: 'Max',
      email: emailParticipant,
    }
  )
  integUtil.addItemToDeleteAfterTest({ PK: postParticipant.data.PK, SK: postParticipant.data.SK });
  expect(postParticipant.status).toEqual(HttpStatusCode.Created);
  expect(postParticipant.data.name).toEqual('Max Mustermann');
  expect(postParticipant.data.displayName).toEqual('Max');
  expect(postParticipant.data.email).toEqual(emailParticipant);
  const checkPostParticipant = await Participant.get({PK: postParticipant.data.PK, SK: postParticipant.data.SK});
  expect(checkPostParticipant?.name).toEqual('Max Mustermann');
  expect(checkPostParticipant?.displayName).toEqual('Max');
  expect(checkPostParticipant?.email).toEqual(emailParticipant);
})

test('post participant for specific event unauthorized', async() => {
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const emailParticipant = `info+${new Date().getTime()}@taimos.de`
  const postParticipant = await integUtil.getClient().post(`/events/${entity.id}/participants`,
    {
      name: 'Max Mustermann',
      displayName: 'Max',
      email: emailParticipant,
    }
  )
  integUtil.addItemToDeleteAfterTest({ PK: postParticipant.data.PK, SK: postParticipant.data.SK });
  expect(postParticipant.status).toEqual(HttpStatusCode.Created);
  expect(postParticipant.data.name).toEqual('Max Mustermann');
  expect(postParticipant.data.displayName).toEqual('Max');
  expect(postParticipant.data.email).toEqual(emailParticipant);
  const checkPostParticipant = await Participant.get({PK: postParticipant.data.PK, SK: postParticipant.data.SK });
  expect(checkPostParticipant?.name).toEqual('Max Mustermann');
  expect(checkPostParticipant?.displayName).toEqual('Max');
  expect(checkPostParticipant?.email).toEqual(emailParticipant);
})

test('post existing participant for specific event', async() => {
  const client = await integUtil.getAuthenticatedClient(adminUserName);
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const emailParticipant = `info+${new Date().getTime()}@taimos.de`;
  const participant = await Participant.create({
    eventId: entity.id,
    name: 'Max Mustermann',
    displayName: 'Max',
    email: emailParticipant,
    confirmed: true
  })
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const postParticipant = await client.post(`/events/${entity.id}/participants`,
    {
      name: 'Max Mustermann',
      displayName: 'Max',
      email: emailParticipant,
    }
  )
  integUtil.addItemToDeleteAfterTest({ PK: postParticipant.data.PK, SK: postParticipant.data.SK });
  expect(postParticipant.status).toEqual(HttpStatusCode.BadRequest);
})

test('post participant for non-existing event', async()=>{
  const client = await integUtil.getAuthenticatedClient(adminUserName);

  const postParticipant = await client.post(`/events/nonexisting/participants`,
    {
      name: 'Max Mustermann',
      displayName: 'Max',
      email: `info+${new Date().getTime()}@taimos.de`,
    }
  )
  integUtil.addItemToDeleteAfterTest({ PK: postParticipant.data.PK, SK: postParticipant.data.SK });
  expect(postParticipant.status).toEqual(HttpStatusCode.NotFound);
})

test('update participant data', async() =>{
  const client = await integUtil.getAuthenticatedClient(adminUserName);
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const emailParticipant = `info+${new Date().getTime()}@taimos.de`;
  const participant = await Participant.create({
    eventId: entity.id,
    name: 'Max Mustermann',
    displayName: 'Max',
    email: emailParticipant,
    confirmed: true
  })
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const updateParticipant = await client.put(`/events/${entity.id}/participants/${participant.participantId}`,
    {
      displayName: 'Mustermann',
    })
  expect(updateParticipant.status).toEqual(HttpStatusCode.Ok);
  const checkUpdate = await Participant.get({PK: `EVENT#${entity.id}` ,SK: `PARTICIPANT#${participant.participantId}`});
  expect(checkUpdate?.displayName).toEqual('Mustermann');
})

test('update participant data unauthorized', async() =>{
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const emailParticipant = `info+${new Date().getTime()}@taimos.de`;
  const participant = await Participant.create({
    eventId: entity.id,
    name: 'Max Mustermann',
    displayName: 'Max',
    email: emailParticipant,
    confirmed: true
  })
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const updateParticipant = await integUtil.getClient().put(`/events/${entity.id}/participants/${participant.participantId}`,
    {
      displayName: 'Mustermann',
    })
  expect(updateParticipant.status).toEqual(HttpStatusCode.Unauthorized);
  const checkUpdate = await Participant.get({PK: `EVENT#${entity.id}`,SK: `PARTICIPANT#${participant.participantId}`});
  expect(checkUpdate?.displayName).toEqual('Max');
})

test('update participant data unauthorized as owner', async() =>{
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const emailParticipant = `info+${new Date().getTime()}@taimos.de`;
  const participant = await Participant.create({
    eventId: entity.id,
    name: 'Max Mustermann',
    displayName: 'Max',
    email: emailParticipant,
    confirmed: true
  })
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const updateParticipant = await integUtil.getClient().put(`/events/${entity.id}/participants/${participant.participantId}?email=${participant.email}`,
    {
      displayName: 'Mustermann',
    })
  expect(updateParticipant.status).toEqual(HttpStatusCode.Ok);
  const checkUpdate = await Participant.get({PK: `EVENT#${entity.id}`,SK: `PARTICIPANT#${participant.participantId}`})
  expect(checkUpdate?.displayName).toEqual('Mustermann');
})

test('update participant data of non-existing participant', async() =>{
  const client = await integUtil.getAuthenticatedClient(adminUserName);
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });

  const updateParticipant = await client.put(`/events/${entity.id}/participants/nonexisting`,
    {
      displayName: 'Mustermann',
    })
  expect(updateParticipant.status).toEqual(HttpStatusCode.BadRequest);
});

test('delete participant for event', async() =>{
  const client = await integUtil.getAuthenticatedClient(adminUserName);
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const emailParticipant = `info+${new Date().getTime()}@taimos.de`;
  const participant = await Participant.create({
    eventId: entity.id,
    name: 'Max Mustermann',
    displayName: 'Max',
    email: emailParticipant,
    confirmed: true
  })
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const deleteParticipant = await client.delete(`/events/${entity.id}/participants/${participant.participantId}`);
  expect(deleteParticipant.status).toEqual(HttpStatusCode.Ok);
  const checkDeleteParticipant = await Participant.get({PK: `EVENT#${entity.id}` ,SK: `PARTICIPANT#${participant.participantId}`});
  expect(checkDeleteParticipant).toBeUndefined();
})

test('delete participant for event unauthorized', async() =>{
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const emailParticipant = `info+${new Date().getTime()}@taimos.de`;
  const participant = await Participant.create({
    eventId: entity.id,
    name: 'Max Mustermann',
    displayName: 'Max',
    email: emailParticipant,
    confirmed: true
  })
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const deleteParticipant = await integUtil.getClient().delete(`/events/${entity.id}/participants/${participant.participantId}`);
  expect(deleteParticipant.status).toEqual(HttpStatusCode.Unauthorized);
  const checkDeleteParticipant = await Participant.get({PK: participant.PK, SK: participant.SK });
  expect(checkDeleteParticipant).toBeDefined();
})

test('delete participant for event unauthorized as owner', async() =>{
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const emailParticipant = `info+${new Date().getTime()}@taimos.de`;
  const participant = await Participant.create({
    eventId: entity.id,
    name: 'Max Mustermann',
    displayName: 'Max',
    email: emailParticipant,
    confirmed: true
  })
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const deleteParticipant = await integUtil.getClient().delete(`/events/${entity.id}/participants/${participant.participantId}?email=${participant.email}`);
  expect(deleteParticipant.status).toEqual(HttpStatusCode.Ok);
  const checkDeleteParticipant = await Participant.get({PK: `EVENT#${entity.id}` ,SK: `PARTICIPANT#${participant.participantId}`});
  expect(checkDeleteParticipant).toBeUndefined();
})


