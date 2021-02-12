import { createAuctionService } from "../factories/auctions";
import createError from 'http-errors';
import { created } from "../helpers/http";
import { useMiddlewares } from "../helpers/middlewares";

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

export const handler = useMiddlewares(createAuction)

