import { Handler } from 'aws-lambda'
import { Key } from 'aws-sdk/clients/dynamodb'
import { dynamoDbClient } from './dynamoClient/dynamoClient';
import { Response } from './interfaces/Response'

const TODO_TABLE = process.env.TODO_TABLE;

export const listTodos: Handler = async (): Promise<Response> => {
  const rawResult = await getAllTodos()
  return rawResult.statusCode === 500
    ? rawResult
    : parseResult(rawResult)
}

const getAllTodos = async (lastKey?: Key): Promise<Response | any> => {
  const {
    $response: response,
    LastEvaluatedKey,
    Items: result
  } = await dynamoDbClient.scan({
    TableName: TODO_TABLE,
    ExclusiveStartKey: lastKey
  }).promise()
  if (response.error) {
    return { statusCode: 500, body: JSON.stringify(response.error) }
  }
  if (LastEvaluatedKey) {
    const nextPage = await getAllTodos(LastEvaluatedKey)
    result.push(...nextPage)
  }
  return result
}

const parseResult = (rawResult: any): Response => {
  return {
    statusCode: 200,
    body: JSON.stringify(rawResult)
  }
}