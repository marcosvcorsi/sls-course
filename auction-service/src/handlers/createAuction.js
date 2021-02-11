import { createAuctionService } from "../factories/auctions";
import { created } from "../helpers/http";

const auctionsService = createAuctionService();

async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);

  const auction = await auctionsService.create({ title });

  return created(auction);
}

export const handler = createAuction;


