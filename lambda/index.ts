import * as AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME || 'colorsDynamoDB';

interface ColorItem {
  color: string;
  category: string;
  type?: string;
  code: {
    rgba: number[];
    hex: string;
  };
}

export const handler = async (event: any) => {
  try {
    const s3Event = event.Records[0].s3;
    const bucketName = s3Event.bucket.name;
    const objectKey = s3Event.object.key;

    const s3 = new AWS.S3();
    const getObjectParams = {
      Bucket: bucketName,
      Key: objectKey,
    };

    const s3Object = await s3.getObject(getObjectParams).promise();
    const objectContent = (s3Object.Body as Buffer).toString('utf-8');
    

    console.log('S3 Object Content:', objectContent);

    const jsonData = JSON.parse(objectContent);
    const colors: ColorItem[] = jsonData.colors;

    for (const color of colors) {
      const params = {
        TableName: tableName,
        Item: {
          color: color.color,
          category: color.category,
          type: color.type || '',
          code: color.code,
        },
      };

      console.log('Writing to DynamoDB:', JSON.stringify(params));
      await dynamoDB.put(params).promise();
    }

    console.log('Colors saved successfully!');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Items saved successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
