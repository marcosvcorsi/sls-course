import { createAuctionService } from "../factories/auctions";

const auctionsService = createAuctionService();

async function processAuctions(event, context) {
  try {
    const auctionsToClose = await auctionsService.findAuctionsToClose();

    await Promise.all(auctionsToClose.map(auction => auctionsService.updateAuctionToClose(auction)));

    return { closed: auctionsToClose.length };
  } catch(error) {
    console.error(error);
  }
}

export const handler = processAuctions;