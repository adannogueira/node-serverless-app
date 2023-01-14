import AWS from 'aws-sdk';

const dynamoDbClientParams: Record<string, string> = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = 'localhost'
  dynamoDbClientParams.endpoint = 'http://localhost:8000'
}

export const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);
