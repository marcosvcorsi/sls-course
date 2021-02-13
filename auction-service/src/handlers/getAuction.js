import { createAuctionService } from "../factories/auctions";
import createError from 'http-errors';
import { ok } from "../helpers/http";
import { useMiddlewares } from "../helpers/middlewares";

const auctionsService = createAuctionService();

async function getAuction(event, context) {
  const { id } = event.pathParameters;

  let auction;

  try {
    auction = await auctionsService.findById(id);
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if(!auction) {
    throw new createError.NotFound('Auction not found!');
  }

  return ok(auction);
}

export const handler = useMiddlewares(getAuction)

