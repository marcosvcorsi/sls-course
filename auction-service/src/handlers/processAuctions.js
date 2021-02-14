import { createAuctionService } from "../factories/auctions";

const auctionsService = createAuctionService();

async function processAuctions(event, context) {
  const auctionsToClose = await auctionsService.findAuctionsToClose();

  console.log(auctionsToClose);
}

export const handler = processAuctions;