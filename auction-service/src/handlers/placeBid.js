import { createAuctionService } from "../factories/auctions";
import createError from 'http-errors';
import { ok } from "../helpers/http";
import { useMiddlewares } from "../helpers/middlewares";

const auctionsService = createAuctionService();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  let auction;

  try {
    auction = await auctionsService.findById(id);
  } catch(error) {
    throw new createError.InternalServerError(error);
  }

  if(!auction) {
    throw new createError.NotFound('Auction not found.');
  }
  
  if(amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`);
  }

  let updatedAuction;

  try {    
    updatedAuction = await auctionsService.patch(id, { amount });
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return ok(auction);
}

export const handler = useMiddlewares(placeBid)

