import { v4 as uuid } from 'uuid';

export const AUCTION_STATUS = {
  OPEN: 'OPEN'
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
    return this.auctionsRepository.findById(id);
  }

  async patch(id, { amount }) {
    return this.auctionsRepository.patch(id, { amount });
  }
}

export default AuctionsService;