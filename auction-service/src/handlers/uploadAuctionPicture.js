import { ok } from "../helpers/http";

async function uploadAuctionPicture(event, context) {
  const { id } = event.pathParameters;

  return ok({});
}

export const handler = uploadAuctionPicture;

