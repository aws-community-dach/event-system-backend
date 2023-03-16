import { AttributeType, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { SingleTableDatastore, SingleTableDatastoreProps } from '@taimos/cdk-serverless-v2/lib/constructs';

export interface EventDatastoreProps extends Omit<SingleTableDatastoreProps, 'design'> {
  //
}

export class EventDatastore extends SingleTableDatastore {

  constructor(scope: Construct, id: string, props: EventDatastoreProps = {}) {
    super(scope, id, {
      ...props,
      design: {
        primaryKey: {
          partitionKey: 'PK',
          sortKey: 'SK',
        },
        // timeToLiveAttribute: 'TODO',
        globalIndexes: [
          {
            indexName: 'GSI1',
            partitionKey: {
              name: 'GSI1PK',
              type: AttributeType.STRING,
            },
            sortKey: {
              name: 'GSI1SK',
              type: AttributeType.STRING,
            },
            projectionType: ProjectionType.ALL,
            
          }
        ],
        localIndexes: [
          
        ],
      }
    });
  }

}