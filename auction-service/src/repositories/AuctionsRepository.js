import AWS from 'aws-sdk';

const TableName = process.env.AUCTIONS_TABLE_NAME;

class AuctionsRepository {
  constructor() {
    this.dynamoDb = new AWS.DynamoDB.DocumentClient();
  }

  async create({ id, title, status, createdAt, endingAt, highestBid, seller }) {
    return this.dynamoDb.put({
      TableName,
      Item: {
        id,
        title,
        createdAt,
        endingAt,
        status,
        highestBid,
        seller
      }
    }).promise();
  }

  async findAll() {
    const { Items } = await this.dynamoDb.scan({
      TableName,
    }).promise();

    return Items;
  }

  async findById(id) {
    const { Item } =  await this.dynamoDb.get({
      TableName,
      Key: { id }
    }).promise();

    return Item;
  }

  async patch(id, { amount, email }) {
    const { Attributes } = await this.dynamoDb.update({
      TableName,
      Key: { id },
      UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
      ExpressionAttributeValues: {
        ':amount': amount,
        ':bidder': email
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

    return Attributes;
  }

  async patchPicture(id, pictureUrl) {
    const { Attributes } = await this.dynamoDb.update({
      TableName,
      Key: { id },
      UpdateExpression: 'set pictureUrl = :pictureUrl',
      ExpressionAttributeValues: {
        ':pictureUrl': pictureUrl
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

    return Attributes;
  }

  async findByStatus(status) {
    const { Items } = await this.dynamoDb.query({
      TableName,
      IndexName: 'statusAndEndDate',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeValues: {
        ':status': status,
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      }
    }).promise()

    return Items;
  }

  async findByStatusAndEndDate(status, endDate) {
    const { Items } = await this.dynamoDb.query({
      TableName,
      IndexName: 'statusAndEndDate',
      KeyConditionExpression: '#status = :status AND endingAt <= :now',
      ExpressionAttributeValues: {
        ':status': status,
        ':now': endDate.toISOString()
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      }
    }).promise()

    return Items;
  }

  async updateAuctionStatus(auction, status) {
    return this.dynamoDb.update({
      TableName,
      Key: { id: auction.id },
      UpdateExpression: 'set #status = :status',
      ExpressionAttributeValues: {
        ':status': status
      },
      ExpressionAttributeNames: {
        '#status': 'status'
      }
    }).promise();
  } 
}

export default AuctionsRepository;