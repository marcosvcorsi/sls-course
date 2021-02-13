import { createAuctionService } from "../factories/auctions";
import createError from 'http-errors';
import { ok } from "../helpers/http";
import { useMiddlewares } from "../helpers/middlewares";

const auctionsService = createAuctionService();

async function placeBid(event, context) {
  try {
    const { id } = event.pathParameters;
    const { amount } = event.body;

    const auction = await auctionsService.patch(id, { amount });

    return ok(auction);
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = useMiddlewares(placeBid)

