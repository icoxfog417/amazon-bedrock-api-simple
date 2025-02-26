import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class BedrockAPIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const bedrockFunction = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'BedrockFunction', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_LATEST,
      handler: 'handler',
      entry: 'lambda/bedrock-function.ts',
      timeout: cdk.Duration.seconds(30),
      memorySize: 256
    });

    // Grant Bedrock invoke permissions to Lambda
    bedrockFunction.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: [
          'bedrock:InvokeModel',
          'bedrock:InvokeModelWithResponseStream'
        ],
        resources: [
          `arn:aws:bedrock:*::foundation-model/*`,
          `arn:aws:bedrock:${this.region}:${this.account}:inference-profile/*`
        ],
      })
    );

    // Create API Gateway
    const api = new cdk.aws_apigateway.RestApi(this, 'BedrockApi', {
      restApiName: 'Bedrock API',
      description: 'API Gateway endpoint for Bedrock integration',
    });

    // Create API resource and method
    const predictResource = api.root.addResource('predict');
    predictResource.addMethod('POST', 
      new cdk.aws_apigateway.LambdaIntegration(bedrockFunction), {
        methodResponses: [{
          statusCode: '200',
          responseModels: {
            'application/json': cdk.aws_apigateway.Model.EMPTY_MODEL,
          },
        }],
      }
    );

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'Bedrock API endpoint URL',
    });

  }
}
