import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {

  const {title}= JSON.parse(event.body);
  const now  = new Date();

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createAt: now.toISOString(),
  };
  //significa o seguinte, o await, "Espere esse código ser rodado" e ao final temos uma promisse que é promessa
  await dynamodb.put({
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Item: auction,
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;


