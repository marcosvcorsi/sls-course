import AWS from 'aws-sdk';

const TableName = process.env.AUCTIONS_TABLE_NAME;

class AuctionsRepository {
  constructor() {
    this.dynamoDb = new AWS.DynamoDB.DocumentClient();
  }

  async create({ id, title, status, createdAt, highestBid }) {
    return this.dynamoDb.put({
      TableName,
      Item: {
        id,
        title,
        createdAt,
        status,
        highestBid
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

  async patch(id, { amount }) {
    const { Attributes } = await this.dynamoDb.update({
      TableName,
      Key: { id },
      UpdateExpression: 'set highestBid.amount = :amount',
      ExpressionAttributeValues: {
        ':amount': amount
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

    return Attributes;
  }
}

export default AuctionsRepository;