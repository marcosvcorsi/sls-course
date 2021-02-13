import { createAuctionService } from "../factories/auctions";
import createError from 'http-errors';
import { ok } from "../helpers/http";
import { useMiddlewares } from "../helpers/middlewares";

const auctionsService = createAuctionService();

async function getAuction(event, context) {
  try {
    const { id } = event.pathParameters;

    const auction = await auctionsService.findById(id);

    if(!auction) {
      throw new createError.NotFound('Auction not found!');
    }

    return ok(auction);
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = useMiddlewares(getAuction)

