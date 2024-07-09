import { IntegTestUtil } from 'cdk-serverless/lib/tests';
import { HttpStatusCode } from 'axios';
import { Event, Participant } from '../../src/generated/datastore.event-model.generated';

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

test('get event details for existing event', async () => {

  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const event = await integUtil.getClient().get(`/events/${entity.id}`);
  expect(event.status).toBe(200);
  expect(event.data.id).toEqual(entity.id);
  expect(event.data.date).toEqual(entity.date?.toISOString());
  expect(event.data.name).toEqual(entity.name);
  expect(event.data.location).toEqual(entity.location);
  expect(event.data.description).toEqual(entity.description);
});

test('create an event unauthorized', async() => {
  const entity = await integUtil.getClient().post('/events' ,
    { date: new Date('2030-07-03'),
      name: 'Event',
      location:'hier',
      description:'tolles Event',
    })
  expect(entity.status).toBe(401);
})

test('create an event authorized', async() => {
  const client = await integUtil.getAuthenticatedClient(adminUserName);
  const entity = await client.post('/events' ,
    { date: new Date('2030-07-03'),
      name: 'Event',
      location:'hier',
      description:'tolles Event',
    })
  integUtil.addItemToDeleteAfterTest({ PK: `EVENT#${entity.data.id}`, SK: 'DETAILS' });
  expect(entity.status).toBe(201);
  expect(entity.data.id).toBeDefined();
  expect(entity.data.date).toEqual('2030-07-03T00:00:00.000Z');
  expect(entity.data.name).toEqual('Event');
  expect(entity.data.location).toEqual('hier');
  expect(entity.data.description).toEqual('tolles Event');
})

test('retrieve a non-existing event', async() => {
  const event = await integUtil.getClient().get(`/events/nonexisting`);
  expect(event.status).toBe(404);
})

test('retrieve list of events', async() => {
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
 
  const event = await integUtil.getClient().get('/events');
  expect(event.status).toBe(200);
  expect(event.data.lenght).toBeGreaterThan(1);
  expect(event.data[0].date).toBeDefined();
  expect(event.data[0].name).toBeDefined();
  expect(event.data[0].location).toBeDefined();
  expect(event.data[0].description).toBeDefined();
  expect(event.data[0].id).toBeDefined();
})

test('update event', async() =>{
  const client = await integUtil.getAuthenticatedClient(adminUserName);
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const updateEvent = await client.put(`/events/${entity.id}`, {location: 'dort drüben', description: 'kommt alle'});
  expect(updateEvent.status).toEqual(HttpStatusCode.Ok);
  const checkUpdateEvent = await Event.get({PK: entity.PK, SK: entity.SK});
  expect(checkUpdateEvent?.location).toEqual('dort drüben');
  expect(checkUpdateEvent?.description).toEqual('kommt alle');
})

test('update event unauthorized', async() =>{
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const updateEvent = await integUtil.getClient().put(`/events/${entity.id}`, {location: 'dort drüben', description: 'kommt alle'});
  expect(updateEvent.status).toEqual(HttpStatusCode.Unauthorized);
  const checkUpdate = await Event.get({PK: entity.PK, SK: entity.SK});
  expect(checkUpdate?.location).toEqual('hier');
  expect(checkUpdate?.description).toEqual('tolles Event');
})

test('delete an existing event', async() => {
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });  
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const client = await integUtil.getAuthenticatedClient(adminUserName);
  const deleteEvent = await client.delete(`/events/${entity.id}`);
  expect(deleteEvent.status).toBe(200);
  const checkDelete = await Event.get({
    id: entity.id,
  });
  expect(checkDelete).toBeUndefined();
})

test('delete an existing event unauthorized', async() => {
  const entity = await Event.create({
    date: new Date('2030-07-03'),
    name: 'Event',
    location:'hier',
    description:'tolles Event',
  });  
  integUtil.addItemToDeleteAfterTest({ PK: entity.PK, SK: entity.SK });
  const deleteEvent = await integUtil.getClient().delete(`/events/${entity.id}`);
  expect(deleteEvent.status).toEqual(HttpStatusCode.Unauthorized);
  const checkDeleteEvent =  await Event.get({PK: entity.PK, SK: entity.SK});
  expect(checkDeleteEvent).toBeDefined();
})

test('delete a non-existing event', async() => {
  const client = await integUtil.getAuthenticatedClient(adminUserName);
  const deleteEvent = await client.delete('/events/non_existing');
  expect(deleteEvent.status).toBe(404);
  expect(deleteEvent).toBeUndefined();
})

test('delete event with participants', async() =>{
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
  });
  integUtil.addItemToDeleteAfterTest({ PK: participant.PK, SK: participant.SK });
  const client = await integUtil.getAuthenticatedClient(adminUserName);
  const deleteEventWithParticipants = await client.delete(`/events/${entity.id}`);
  expect(deleteEventWithParticipants.status).toEqual(HttpStatusCode.BadRequest)
  const checkDeleteEvent = await Event.get({PK: entity.PK, SK: entity.SK});
  expect(checkDeleteEvent).toBeDefined();
})

