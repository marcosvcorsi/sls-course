import AuctionsRepository from '../repositories/AuctionsRepository';
import AuctionsService from '../services/AuctionsService';

export const createAuctionService = () => {
  const auctionsRepository = new AuctionsRepository();
  const auctionsService = new AuctionsService({ auctionsRepository });

  return auctionsService;
};