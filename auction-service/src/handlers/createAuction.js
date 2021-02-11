import { created } from "../helpers/http";

async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);

  const auction = {
    title,
    status: 'OPEN',
    createAt: new Date().toISOString(),
  };

  return created(auction);
}

export const handler = createAuction;


