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
      createdAt
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
}

export default AuctionsService;