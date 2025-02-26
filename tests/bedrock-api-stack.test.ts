import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { BedrockAPIStack } from '../lib/bedrock-api-stack';

describe('BedrockAPIStack Tests', () => {
  let app: cdk.App;
  let stack: BedrockAPIStack;
  let template: Template;

  beforeEach(() => {
    // GIVEN
    app = new cdk.App();
    // WHEN
    stack = new BedrockAPIStack(app, 'TestBedrockAPIStack');
    // THEN
    template = Template.fromStack(stack);
  });
  
  test('Stack creates all expected resources', () => {
    // This test ensures we have the correct number of each resource type
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
    template.resourceCountIs('AWS::ApiGateway::Resource', 1);
    template.resourceCountIs('AWS::ApiGateway::Method', 1);
    template.resourceCountIs('AWS::ApiGateway::Deployment', 1);
    template.resourceCountIs('AWS::ApiGateway::Stage', 1);
  });

  test('Lambda Function Created with correct properties', () => {
    // Verify Lambda function exists with correct configuration
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler', // The handler name from the implementation
      Runtime: 'nodejs18.x', // NODEJS_LATEST resolves to nodejs20.x
      Timeout: 30,
      MemorySize: 256
    });
  });

  test('Lambda Function has correct IAM permissions for Bedrock', () => {
    // Verify IAM policy is created with proper Bedrock permissions
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "bedrock:InvokeModel",
              "bedrock:InvokeModelWithResponseStream"
            ],
            Effect: "Allow",
            Resource: [
              "arn:aws:bedrock:*::foundation-model/*",
              {
                "Fn::Join": [
                  "",
                  [
                    "arn:aws:bedrock:",
                    {
                      "Ref": "AWS::Region"
                    },
                    ":",
                    {
                      "Ref": "AWS::AccountId"
                    },
                    ":inference-profile/*"
                  ]
                ]
              }
            ]
          }
        ]
      }
    });
  });

  test('API Gateway REST API Created', () => {
    // Verify API Gateway exists with correct configuration
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'Bedrock API',
      Description: 'API Gateway endpoint for Bedrock integration'
    });
  });

  test('API Gateway resource and POST method created', () => {    
    // Verify API Gateway method is created with correct HTTP method and path
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      AuthorizationType: 'NONE',
      ResourceId: {
        "Ref": Match.anyValue()
      },
      RestApiId: {
        "Ref": Match.anyValue()
      }
    });
  });

  test('API Gateway integrated with Lambda function', () => {
    // Verify integration exists between API Gateway and Lambda
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'AWS_PROXY',
        IntegrationHttpMethod: 'POST'
      }
    });
  });

  test('API Endpoint output is created', () => {
    // Verify that API endpoint URL is exposed as stack output
    template.hasOutput('ApiEndpoint', {
      Description: 'Bedrock API endpoint URL'
    });
  });
  
  // Add a snapshot test as an additional safety net
  test('Stack matches snapshot', () => {
    // This helps catch any unintended changes to the infrastructure
    expect(JSON.stringify(template.toJSON())).toMatchSnapshot();
  });
});
