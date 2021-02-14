import { createAuctionService } from "../factories/auctions";
import createError from 'http-errors';
import validator from '@middy/validator';
import { created } from "../helpers/http";
import { useMiddlewares } from "../helpers/middlewares";

const auctionsService = createAuctionService();

const inputSchema = {
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        }
      },
      required: ['title']
    }
  },
  required: [
    'body'
  ]
}

async function createAuction(event, context) {
  const { title } = event.body;
  const { email } = event.requestContext.authorizer;

  try {
    const auction = await auctionsService.create({ title, seller: email });

    return created(auction);
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = useMiddlewares(createAuction).use(validator({
  inputSchema,
}))

