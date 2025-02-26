# Bedrock Chat API Solution

The solution implements an API endpoint that integrates API Gateway with AWS Lambda to interact with Amazon Bedrock's Claude 3 Haiku model. Here's what's been implemented:

1. **CDK Stack (lib/cdk_examples-stack.ts)**:
   - Creates a Lambda function with Node.js 18.x runtime
   - Configures IAM permissions for Bedrock access
   - Sets up API Gateway with a POST /chat endpoint
   - Outputs the API endpoint URL

2. **Lambda Function (lambda/bedrock-chat.ts)**:
   - Uses the Bedrock Runtime Client with ConverseCommand
   - Accepts messages through API Gateway POST requests
   - Formats the conversation for Claude 3 Haiku model
   - Returns the model's response

3. **Dependencies**:
   - Added @aws-sdk/client-bedrock-runtime package

To test the API:
1. Deploy the stack using `cdk deploy`
2. Send a POST request to the API endpoint with JSON body: 
```json
{
    "message": "Your question here"
}
```
