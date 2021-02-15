import AuctionsRepository from '../repositories/AuctionsRepository';
import AuctionsService from '../services/AuctionsService';
import MessageService from '../services/MessageService';

export const createAuctionService = () => {
  const auctionsRepository = new AuctionsRepository();
  const messageService = new MessageService();
  const auctionsService = new AuctionsService({ auctionsRepository, messageService });

  return auctionsService;
};