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
    const createdAt = new Date().toISOString();

    const auction = {
      id,
      title,
      status,
      createdAt,
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