import { createAuctionService } from "../factories/auctions";
import createError from 'http-errors';
import validator from '@middy/validator';
import { ok } from "../helpers/http";
import { useMiddlewares } from "../helpers/middlewares";
import { AUCTION_STATUS } from "../services/AuctionsService";

const auctionsService = createAuctionService();

const inputSchema = {
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(AUCTION_STATUS),
          default: AUCTION_STATUS.OPEN
        }
      }
    }
  },
  required: [
    'queryStringParameters'
  ]
}

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;

  try {
    const auctions = await auctionsService.findByStatus(status);

    return ok(auctions);
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = useMiddlewares(getAuctions).use(validator({
  inputSchema,
  useDefaults: true
}))

