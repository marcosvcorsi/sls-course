import { v4 as uuid } from 'uuid';
import InvalidOperationError from '../errors/InvalidOperationError';
import NotFoundError from '../errors/NotFoundError';

export const AUCTION_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED'
};

class AuctionsService {
  constructor({ auctionsRepository, messageService }) {
    this.auctionsRepository = auctionsRepository;
    this.messageService = messageService;
  }

  async create({ title, seller }) {
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
      },
      seller,
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

  async patch(id, { amount, email }) {
    const auction = await this.findById(id);

    if(auction.status !== AUCTION_STATUS.OPEN) {
      throw new InvalidOperationError('Auction is not open');
    }

    if(email === auction.seller) {
      throw new InvalidOperationError('You cant bid on your own auctions');
    }

    if(email === auction.highestBid.bidder) {
      throw new InvalidOperationError('You are already the highest bidder');
    }

    if(amount <= auction.highestBid.amount) {
      throw new InvalidOperationError(`Your bid must be higher than ${auction.highestBid.amount}`);
    }

    return this.auctionsRepository.patch(id, { amount, email });
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
    await this.auctionsRepository.updateAuctionStatus(auction, AUCTION_STATUS.CLOSED);

    return this.notifyAuctionClosed(auction);
  }

  async notifyAuctionClosed(auction) {
    const { title, seller, highestBid } = auction;
    const { amount, bidder } = highestBid;

    const queue = process.env.MAIL_QUEUE_URL;

    console.log('queue', queue);

    if(!amount) {
      const sellerContent = {
        subject: 'No bids on your auction item :(',
        to: seller,
        message: `Oh no! Your item ${title} didn't get any bids. Better luck next item`
      }
  
      console.log('seller message', sellerContent);
  
      return this.messageService.sendMessage({
        queue,
        message: JSON.stringify(sellerContent)
      })
    } else {
      const sellerContent = {
        subject: 'Your item has been sold!',
        to: seller,
        message: `Wooho! Your item ${title} has been sold for $${amount}`
      }
  
      console.log('seller message', sellerContent);
  
      const notifySeller = this.messageService.sendMessage({
        queue,
        message: JSON.stringify(sellerContent)
      })
  
      const bidderContent = {
        subject: 'You won an auction!',
        to: bidder,
        message: `What a great deal! You got yoursel a ${title} for $${amount}`
      }
  
      console.log('bidder message', bidderContent);
  
      const notifyBidder = this.messageService.sendMessage({
        queue,
        message: JSON.stringify(bidderContent)
      })
  
      return Promise.all([notifySeller, notifyBidder]);
    }
  }
}

export default AuctionsService;