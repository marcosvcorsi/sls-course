import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';
import { createAuctionService } from '../factories/auctions';
import NotFoundError from "../errors/NotFoundError";
import { noContent } from "../helpers/http";
import UploadService from '../services/UploadService';

const auctionsService = createAuctionService();
const uploadService = new UploadService(process.env.AUCTIONS_BUCKET_NAME);

async function uploadAuctionPicture(event, context) {
  const { id } = event.pathParameters;
  
  try {
    
    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');

    const buffer = Buffer.from(base64, 'base64');

    const auction = await auctionsService.findById(id);

    const { Location } = await uploadService.upload(`${auction.id}.jpg`, buffer);

    await auctionsService.updateAuctionPicture(id, Location);
  
    return noContent();
  } catch(error) {
    if(error instanceof NotFoundError) {
      throw new createError.NotFound(error.message);
    } else {
      console.error(error);
      throw new createError.InternalServerError(error);
    }
  }

}

export const handler = middy(uploadAuctionPicture).use(httpErrorHandler());

