import { Handler } from 'aws-lambda'
import { Response } from './interfaces/Response'
import { dynamoDbClient } from './dynamoClient/dynamoClient';

const TODO_TABLE = process.env.TODO_TABLE;

export const deleteTodo: Handler = async ({
  pathParameters: { id } }: any
): Promise<Response> => {
  const {
    $response: response
  } = await dynamoDbClient.delete({
    TableName: TODO_TABLE,
    Key: { id }
  }).promise()
  if (response.error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Todo not found'})
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Todo deleted successfully' })
  }
}
