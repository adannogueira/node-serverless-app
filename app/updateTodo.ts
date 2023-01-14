import AWS from "aws-sdk"
import { Handler } from 'aws-lambda'
import { Key } from 'aws-sdk/clients/dynamodb'
import { Response } from './interfaces/Response'

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

export const updateTodo: Handler = async ({
  pathParameters: { id }, body }: any
): Promise<Response> => {
  const params = buildParams(body)
  const result = await updateTodoById(id, params)
  return result
}

const buildParams = ({ checked, todo }) => {
  const params = {
    TableName: TODO_TABLE,
    UpdateExpression: 'SET ',
    ExpressionAttributeValues: {}
  }
  if (typeof checked === 'boolean') {
    params.UpdateExpression += 'checked = :checked,'
    params.ExpressionAttributeValues[':checked'] = checked
  }
  if (typeof todo === 'string') {
    params.UpdateExpression += 'todo = :todo,'
    params.ExpressionAttributeValues[':todo'] = todo
  }
  params.UpdateExpression += 'updatedAt = :updatedAt'
  params.ExpressionAttributeValues[':updatedAt'] = new Date().toDateString()
  return params
}

const updateTodoById = async (
  id: Key,
  params: any
): Promise<Response> => {
  const {
    $response: response
  } = await dynamoDbClient.update({
    ...params,
    Key: { id }
  }).promise()
  if (response.error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: response.error })
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Todo updated successfully' })
  }
}
