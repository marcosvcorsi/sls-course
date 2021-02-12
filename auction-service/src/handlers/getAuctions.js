import { createAuctionService } from "../factories/auctions";
import createError from 'http-errors';
import { ok } from "../helpers/http";
import { useMiddlewares } from "../helpers/middlewares";

const auctionsService = createAuctionService();

async function getAuctions(event, context) {
  try {
    const auctions = await auctionsService.findAll();

    return ok(auctions);
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = useMiddlewares(getAuctions)

