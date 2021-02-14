import { createAuctionService } from "../factories/auctions";
import createError from 'http-errors';
import { ok } from "../helpers/http";
import { useMiddlewares } from "../helpers/middlewares";
import NotFoundError from "../errors/NotFoundError";

const auctionsService = createAuctionService();

async function getAuction(event, context) {
  const { id } = event.pathParameters;

  try {
    const auction = await auctionsService.findById(id);

    return ok(auction);
  } catch(error) {
    if(error instanceof NotFoundError) {
      throw new createError.NotFound(error.message);
    } else {
      console.error(error);
      throw new createError.InternalServerError(error);
    }
  }
}

export const handler = useMiddlewares(getAuction)

