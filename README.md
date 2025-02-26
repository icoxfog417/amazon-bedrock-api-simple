# Amazon Bedrock Simple API by CDK

The solution implements an API endpoint that integrates API Gateway with AWS Lambda to interact with Amazon Bedrock models. Here's what's been implemented:

1. **CDK Stack (lib/bedrock-api-stack.ts)**:
   - Creates a Lambda function with Node.js 18.x runtime
   - Configures IAM permissions for Bedrock access
   - Sets up API Gateway with a POST /chat endpoint
   - Outputs the API endpoint URL

2. **Lambda Function (lambda/bedrock-function.ts)**:
   - Uses the Bedrock Runtime Client with ConverseCommand
   - Accepts messages through API Gateway POST requests
   - Returns the model's response

3. **Dependencies**:
   - Added @aws-sdk/client-bedrock-runtime package

To test the API:
1. Deploy the stack using `npm run cdk:deploy`
2. Send a POST request to the API endpoint with JSON body: 
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"modelId": "us.anthropic.claude-3-7-sonnet-20250219-v1:0", "message":"Hello!"}' \
     https://l6nbgks5q8.execute-api.us-east-1.amazonaws.com/prod/predict
```
