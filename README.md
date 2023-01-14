# Serverless Framework Typescript on AWS

A simple todo app to demonstrate the serverless framework usability with Node and Typescript.

## Usage

### Deployment

Install dependencies with:

```
yarn install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying node-serverless-app to stage dev (us-east-1)
Compiling with Typescript...
Using local tsconfig.json - tsconfig.json
Typescript compiled.

✔ Service deployed to stack node-serverless-app-dev (142s)

endpoints:
  POST - https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/todos
  GET - https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/todos
  GET - https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/todos/{id}
  DELETE - https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/todos/{id}
  PUT - https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/todos/{id}
functions:
  create: node-serverless-app-dev-create (14 MB)                                                                                                     
  list: node-serverless-app-dev-list (14 MB)
  find: node-serverless-app-dev-find (14 MB)
  delete: node-serverless-app-dev-delete (14 MB)
  update: node-serverless-app-dev-update (14 MB)
```

### Invocation

After successful deployment, you can create a new todo by calling the corresponding endpoint:

```bash
curl --location --request POST 'https://xxxxxxx.execute-api.us-east-1.amazonaws.com/dev/todos' \
--header 'Content-Type: application/json' \
--data-raw '{
    "todo": "Any message"
}'
```

Which should result in the following response:

```bash
{\"statusCode\": 201, \"body\": {\"message\": \"Todo created successfully\"}}
```

### Local development

It is also possible to emulate DynamoDB, API Gateway and Lambda locally using the `serverless-dynamodb-local` and `serverless-offline` plugins. In order to do that, run:

```bash
serverless plugin install -n serverless-dynamodb-local
serverless plugin install -n serverless-offline
```

It will add both plugins to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`. Make sure that `serverless-offline` is listed as last plugin in `plugins` section:

```
plugins:
  - serverless-dynamodb-local
  - serverless-offline
```

You should also add the following config to `custom` section in `serverless.yml`:

```
custom:
  (...)
  dynamodb:
    start:
      migrate: true
    stages:
      - dev
```

Additionally, we need to reconfigure `AWS.DynamoDB.DocumentClient` to connect to our local instance of DynamoDB. We can take advantage of `IS_OFFLINE` environment variable set by `serverless-offline` plugin and replace:

```javascript
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
```

with the following:

```javascript
const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = 'localhost'
  dynamoDbClientParams.endpoint = 'http://localhost:8000'
}
const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);
```

After that, running the following command with start both local API Gateway emulator as well as local instance of emulated DynamoDB:

```bash
serverless offline start
```

To learn more about the capabilities of `serverless-offline` and `serverless-dynamodb-local`, please refer to their corresponding GitHub repositories:
- https://github.com/dherault/serverless-offline
- https://github.com/99x/serverless-dynamodb-local
