import { IntegTestUtil } from 'cdk-serverless/lib/tests';
// import { Event, Index_GSI1_Name } from '../../src/generated/datastore.event-model.generated';

const integUtil = new IntegTestUtil({
  region: 'eu-central-1',
  apiOptions: {
    baseURL: 'https://api.events-test.aws-community.de',
  },
  datastoreOptions: {
    tableName: 'Dev-App-EventData1BF73A70-WL8SVRQO2555',
  },
});

test('get event details for existing event', async () => {
  const event = await integUtil.getClient().get('/events/01H0XNCXEB0DBFGZXK9GQPBRZZ');
  expect(event.status).toBe(200);
  console.log(event.data);

  // const events = await Event.find({}, { index: Index_GSI1_Name });
  // console.log(events);

});