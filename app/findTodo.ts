import { Handler } from 'aws-lambda'
import { dynamoDbClient } from './dynamoClient/dynamoClient';
import { Response } from './interfaces/Response'

const TODO_TABLE = process.env.TODO_TABLE;

export const findTodo: Handler = async ({
  pathParameters: { id } }: any
): Promise<Response> => {
  const {
    $response: response,
    Item: todo
  } = await dynamoDbClient.get({
    TableName: TODO_TABLE,
    Key: { id }
  }).promise()
  if (response.error || !todo) {
    return { statusCode: 404, body: JSON.stringify({ message: 'Todo not found'}) }
  }
  return { statusCode: 200, body: JSON.stringify(todo) }
}
