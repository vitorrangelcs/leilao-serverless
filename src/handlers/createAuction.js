import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {

  const {title}= event.body;
  const now  = new Date();

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createAt: now.toISOString(),
  };
  //significa o seguinte, o await, "Espere esse código ser rodado" e ao final temos uma promisse que é promessa
  try{
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise();
  }catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(createAuction)
                      //O analisador de corpo passara automaticamente pelo nosso corpo,tornando o codigo mais limpo, com ele removemos do const title= JSON.parse(event.body), tiramos o json.parse
                      .use(httpJsonBodyParser())
                      //ajustara automaticamente os objetos. evitando objetos inexistentes
                      .use(httpEventNormalizer())
                      //nos ajuda na manipulaç~ao de erros
                      .use(httpErrorHandler());