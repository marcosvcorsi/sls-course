import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';
import createError from 'http-errors';
import { createAuctionService } from '../factories/auctions';
import NotFoundError from "../errors/NotFoundError";
import { ok } from "../helpers/http";
import UploadService from '../services/UploadService';
import InvalidOperationError from '../errors/InvalidOperationError';

const auctionsService = createAuctionService();
const uploadService = new UploadService(process.env.AUCTIONS_BUCKET_NAME);

async function uploadAuctionPicture(event, context) {
  const { id } = event.pathParameters;
  const { email } = event.requestContext.authorizer;
  
  try {

    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');

    const buffer = Buffer.from(base64, 'base64');

    const auction = await auctionsService.findById(id);

    if(auction.seller !== email) {
      throw new InvalidOperationError(`You can't update this auction picture`);
    }

    const { Location } = await uploadService.upload(`${auction.id}.jpg`, buffer);

    const updatedAuction = await auctionsService.updateAuctionPicture(id, Location);
  
    return ok(updatedAuction);
  } catch(error) {
    if(error instanceof NotFoundError) {
      throw new createError.NotFound(error.message);
    } else if(error instanceof InvalidOperationError) {
      throw new createError.Forbidden(error.message) 
    } else {
      console.error(error);
      throw new createError.InternalServerError(error);
    }
  }

}

export const handler = middy(uploadAuctionPicture)
  .use(httpErrorHandler())
  .use(cors());

