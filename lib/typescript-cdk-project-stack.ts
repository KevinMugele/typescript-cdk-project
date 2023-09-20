import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as eventsources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as iam from 'aws-cdk-lib/aws-iam';

export class TypescriptCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, 'kevin-colors-bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: "kevin-colors-bucket-2",
    });

    const dynamoTable = new dynamodb.Table(this, 'colorsDynamoDB', {
      tableName: "colorsDynamoDB",
      partitionKey: { name: 'color', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const dynamoAccessPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:Query', 'dynamodb:Scan', 'dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
      resources: [dynamoTable.tableArn],
    });

    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));
    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));
    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSLambda_FullAccess'));
    lambdaRole.addToPolicy(dynamoAccessPolicy);

    const lambdaFunction = new lambda.Function(this, 'colorsLambda', {
      functionName: 'myColorsLambda',
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('dist/lambda/'),
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        BUCKET_NAME: s3Bucket.bucketName
      },
      role: lambdaRole,
    });

    s3Bucket.grantPut(lambdaFunction);
    dynamoTable.grantReadWriteData(lambdaFunction);

    lambdaFunction.addEventSource(new eventsources.S3EventSource(s3Bucket, {
      events: [s3.EventType.OBJECT_CREATED],
      filters: [{ suffix: '.json' }],
    }));
  }
}
