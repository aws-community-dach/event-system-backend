import { Construct } from 'constructs';
import { RestApi, RestApiProps } from '@taimos/cdk-serverless-v2/lib/constructs';
import { operations, paths } from './rest.registrationapi-model.generated';

export interface RegistrationApiRestApiProps extends Omit<RestApiProps<operations>, 'definitionFileName' | 'apiName'> {
  //
}

export class RegistrationApiRestApi extends RestApi<paths, operations> {

  constructor(scope: Construct, id: string, props: RegistrationApiRestApiProps) {
    super(scope, id, {
      ...props,
      apiName: 'RegistrationApi',
      definitionFileName: './src/definitions/registration-api.yaml',
    });
  }

}