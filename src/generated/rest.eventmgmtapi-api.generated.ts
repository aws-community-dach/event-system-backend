import { Construct } from 'constructs';
import { RestApi, RestApiProps } from '@taimos/cdk-serverless-v2/lib/constructs';
import { operations, paths } from './rest.eventmgmtapi-model.generated';

export interface EventMgmtApiRestApiProps extends Omit<RestApiProps<operations>, 'definitionFileName' | 'apiName'> {
  //
}

export class EventMgmtApiRestApi extends RestApi<paths, operations> {

  constructor(scope: Construct, id: string, props: EventMgmtApiRestApiProps) {
    super(scope, id, {
      ...props,
      apiName: 'EventMgmtApi',
      definitionFileName: './src/definitions/event-management-api.yaml',
    });
  }

}