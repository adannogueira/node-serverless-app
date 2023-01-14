import AWS from "aws-sdk"
import { Handler } from 'aws-lambda'
import { v4 as uuid } from 'uuid'
import { TodoParams } from './interfaces/TodoParams';
import { Response } from './interfaces/Response';

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

export const createTodo: Handler = async (event: any): Promise<Response> => {
  const { todo } = JSON.parse(event.body)
  if (typeof todo !== 'string') return { statusCode: 400, body: "Invalid todo value" }
  const params = buildParams(todo)
  const result = await createDynamoData(params)
  return result
}

const buildParams = (todo: string): TodoParams => ({
  TableName: TODO_TABLE,
  Item: {
    id: uuid(),
    todo,
    checked: false,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString()
  }
})

const createDynamoData = async (params: TodoParams): Promise<Response> => {
  const { $response: response } = await dynamoDbClient.put(params).promise()
  console.log(response)
  return response.error
    ? { statusCode: 500, body: JSON.stringify(response.error) }
    : { statusCode: 201, body: 'Todo created successfully' }
}
