import AWS from 'aws-sdk';
import commonMiddleware from './lib/commonMiddleware';
import createError from 'http-errors';
import {getAuctionById} from './getAuction';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuctionById(id);

  if(auction.status !== 'OPEN'){
    throw new createError.Forbidden("Leilão fechado, você não pode dar lances.");
  }

  if(amount <= auction.hisghestBid.amount){
    throw new createError.Forbidden(`Seu lance precisa ser maior que o anterior que é de ${auction.hisghestBid.amount}.`);
  }
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set hisghestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  };

  let updatedAuction;

  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}
export const handler = commonMiddleware(placeBid);