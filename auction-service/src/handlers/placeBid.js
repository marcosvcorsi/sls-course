import { createAuctionService } from "../factories/auctions";
import createError from 'http-errors';
import { ok } from "../helpers/http";
import { useMiddlewares } from "../helpers/middlewares";
import NotFoundError from "../errors/NotFoundError";
import InvalidOperationError from "../errors/InvalidOperationError";

const auctionsService = createAuctionService();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  try {
    const auction = await auctionsService.patch(id, { amount });

    return ok(auction);
  } catch(error) {
    if(error instanceof NotFoundError) {
      throw new createError.NotFound(error.message);
    } else if(error instanceof InvalidOperationError) {
      throw new createError.Forbidden(error.message);
    } else {
      console.error(error);
      throw new createError.InternalServerError(error);
    }
  }
}

export const handler = useMiddlewares(placeBid)

