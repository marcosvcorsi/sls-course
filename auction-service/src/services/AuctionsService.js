import { v4 as uuid } from 'uuid';
import InvalidOperationError from '../errors/InvalidOperationError';
import NotFoundError from '../errors/NotFoundError';

export const AUCTION_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED'
};

class AuctionsService {
  constructor({ auctionsRepository }) {
    this.auctionsRepository = auctionsRepository;
  }

  async create({ title }) {
    const id = uuid();
    const status = AUCTION_STATUS.OPEN;
    
    const now = new Date();
    const createdAt = now.toISOString();

    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);

    const endingAt = endDate.toISOString();

    const auction = {
      id,
      title,
      status,
      createdAt,
      endingAt,
      highestBid: {
        amount: 0,
      }
    };

    await this.auctionsRepository.create(auction);

    return auction;
  }

  async findAll() {
    return this.auctionsRepository.findAll();
  }

  async findById(id) {
    const auction = await this.auctionsRepository.findById(id);

    if(!auction) {
      throw new NotFoundError('Auction not found');
    }

    return this.auctionsRepository.findById(id);
  }

  async patch(id, { amount }) {
    const auction = await this.findById(id);

    if(auction.status !== AUCTION_STATUS.OPEN) {
      throw new InvalidOperationError('Auction is not open');
    }

    if(amount <= auction.highestBid.amount) {
      throw new InvalidOperationError(`Your bid must be higher than ${auction.highestBid.amount}`);
    }

    return this.auctionsRepository.patch(id, { amount });
  }

  async findByStatus(status) {
    return this.auctionsRepository.findByStatus(status);
  }

  async findAuctionsToClose() {
    const now = new Date();

    console.log(now.toISOString());

    return this.auctionsRepository.findByStatusAndEndDate(AUCTION_STATUS.OPEN, now);
  }

  async updateAuctionToClose(auction) {
    return this.auctionsRepository.updateAuctionStatus(auction, AUCTION_STATUS.CLOSED);
  }
}

export default AuctionsService;