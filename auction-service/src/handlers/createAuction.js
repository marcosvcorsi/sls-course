import { createAuctionService } from "../factories/auctions";
import { created } from "../helpers/http";

import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const auctionsService = createAuctionService();

async function createAuction(event, context) {
  const { title } = event.body;

  try {
    const auction = await auctionsService.create({ title });

    return created(auction);
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = middy(createAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());


