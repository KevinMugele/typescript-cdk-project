# Full Stack TypeScript AWS CDK Project

## Project Overview

This project demonstrates how to build a TypeScript application using the AWS Cloud Development Kit (CDK) to deploy various AWS resources. The primary goal is to deploy the following AWS resources:

1. A Lambda function
2. An S3 bucket
3. A DynamoDB table

Additionally, this project demonstrates the following functionality:

- Putting a `.json` file in the S3 bucket with mock data.
- Creating a TypeScript Lambda function that reads the JSON file from the S3 bucket, parses it, and writes the data to the DynamoDB table.

## Requirements

Before you begin, make sure you have the following prerequisites installed:

- Node.js v14
- AWS CDK v2

## Getting Started

Follow these steps to deploy the project locally:

1. Clone this GitHub repository:

   ```
   git clone git@github.com:KevinMugele/typescript-cdk-project.git
   cd typescript-cdk-project
   ```

2. Install project dependencies:

    ```
    npm install
    ```
3. Compile Javascript file from Typescript Lambda

    ```
    npm run build
    ```

4. Deploy the AWS resources:

    ```
    cdk deploy
    ```

## Project Structure
The project is organized as follows:

- lib/typescript-cdk-project-stack.ts: Contains the AWS CDK stack definition.
- lambda/index.ts: Defines the TypeScript Lambda function that reads from S3 and writes to DynamoDB.
- bin/typescript-cdk-project.ts: The entry point for the CDK app.

## Configuration
You can customize the AWS resources and Lambda function behavior by modifying the code in lib/typescript-cdk-project-stack.ts and lambda/index.ts. The environment variables for the Lambda function are also defined in the stack file.

## Deploying Changes
If you make changes to the code or configuration, you can redeploy the stack using the following command:

```
cdk deploy
```

## Cleanup
To remove all deployed AWS resources, run:

```
cdk destroy
```

## Contributors

This project has been created by [Kevin Mugele](https://www.github.com/kevinmugele)
