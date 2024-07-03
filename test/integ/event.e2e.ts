import { IntegTestUtil, parseCfnOutputs } from 'cdk-serverless/lib/tests';
import * as outputs from '../../cdk-outputs-dev.json';
// import { Event, Index_GSI1_Name } from '../../src/generated/datastore.event-model.generated';

const integUtil = new IntegTestUtil(parseCfnOutputs(outputs, 'Dev-App', {
  region: 'eu-central-1',
  apiName: 'EventMgmtApi',
  datastoreName: 'Event',
}));

test('get event details for existing event', async () => {
  const event = await integUtil.getClient().get('/events/01H0XNCXEB0DBFGZXK9GQPBRZZ');
  expect(event.status).toBe(200);
  console.log(event.data);

  // const events = await Event.find({}, { index: Index_GSI1_Name });
  // console.log(events);

});