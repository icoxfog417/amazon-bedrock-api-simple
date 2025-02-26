import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BedrockRuntimeClient, ConverseCommand, ConversationRole } from "@aws-sdk/client-bedrock-runtime";

export const handler = async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    try {
        const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
        
        // Get the message from request body
        const body = JSON.parse(event.body || '{}');
        const message = body.message || '';
        const modelId = body.modelId || '';

        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Message is required' }),
            };
        }

        if (!modelId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Model Id is required' }),
            };
        }

        // Prepare conversation messages
        const conversation = [
            {
                role: ConversationRole.USER,
                content: [{ text: message }]
            }
        ];

        // Create command for Claude model
        const command = new ConverseCommand({
            modelId,
            messages: conversation,
            inferenceConfig: { 
                maxTokens: 512, 
                temperature: 0.5, 
                topP: 0.9 
            }
        });
        const response = await client.send(command);

        // Extract and return the response
        const responseText = response.output?.message?.content?.[0]?.text || "No response text available";
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                response: responseText,
            }),
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal Server Error',
                details: errorMessage,
            }),
        };
    }
};
