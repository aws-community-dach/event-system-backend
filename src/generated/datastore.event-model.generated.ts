/* eslint-disable */
import { Model, Table, Entity } from 'dynamodb-onetable';
import { env } from 'process';
import { Dynamo } from 'dynamodb-onetable/Dynamo';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const dynamoClient = new Dynamo({ client: new DynamoDBClient({}) })
export const TABLE_NAME: string = env.TABLE!;

export const Index_primary_Name = 'primary';
export const Index_primary_HashKey = 'PK';
export const Index_primary_SortKey = 'SK';

export const Index_GSI1_Name = 'GSI1';
export const Index_GSI1_HashKey = 'GSI1PK';
export const Index_GSI1_SortKey = 'GSI1SK';


export const Schema = {
  "indexes": {
    "primary": {
      "hash": "PK",
      "sort": "SK"
    },
    "GSI1": {
      "hash": "GSI1PK",
      "sort": "GSI1SK",
      "project": "all"
    }
  },
  "models": {
    "Event": {
      "PK": {
        "type": String,
        "value": "EVENT#${id}"
      },
      "SK": {
        "type": String,
        "value": "DETAILS"
      },
      "id": {
        "type": String,
        "required": true,
        "generate": "ulid"
      },
      "GSI1PK": {
        "type": String,
        "value": "EVENTS"
      },
      "GSI1SK": {
        "type": String,
        "value": "${date}"
      },
      "name": {
        "type": String,
        "required": true
      },
      "date": {
        "type": Date,
        "required": true
      },
      "location": {
        "type": String,
        "required": true
      },
      "description": {
        "type": String
      }
    },
    "Participant": {
      "PK": {
        "type": String,
        "value": "EVENT#${eventId}"
      },
      "SK": {
        "type": String,
        "value": "PARTICIPANT#${email}"
      },
      "eventId": {
        "type": String,
        "required": true
      },
      "GSI1PK": {
        "type": String,
        "value": "PARTICIPANTS"
      },
      "GSI1SK": {
        "type": String,
        "value": "${email}"
      },
      "name": {
        "type": String,
        "required": true
      },
      "displayName": {
        "type": String,
        "required": true
      },
      "email": {
        "type": String,
        "required": true
      },
      "customData": {
        "type": String,
        "required": false
      },
      "confirmed": {
        "type": Boolean,
        "required": true
      },
      "token": {
        "type": String,
        "generate": "uuid",
        "required": true
      }
    }
  },
  "version": "0.1.0",
  "format": "onetable:1.1.0",
  "queries": {}
};

export const table = new Table({
  client: dynamoClient,
  name: TABLE_NAME,
  schema: Schema,
  isoDates: true,
  // logger: true,
  hidden: false,
});

export type EventType = Entity<typeof Schema.models.Event>;
export const Event: Model<EventType> = table.getModel<EventType>('Event');

export type ParticipantType = Entity<typeof Schema.models.Participant>;
export const Participant: Model<ParticipantType> = table.getModel<ParticipantType>('Participant');


