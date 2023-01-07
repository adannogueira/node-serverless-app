export interface TodoParams {
  TableName: string
  Item: {
    id: string
    todo: string
    checked: boolean
    createdAt: string
    updatedAt: string
  }
}
