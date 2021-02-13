import AWS from 'aws-sdk';

const TableName = process.env.AUCTIONS_TABLE_NAME;

class AuctionsRepository {
  constructor() {
    this.dynamoDb = new AWS.DynamoDB.DocumentClient();
  }

  async create({ id, title, status, createdAt }) {
    return this.dynamoDb.put({
      TableName,
      Item: {
        id,
        title,
        createdAt,
        status
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
}

export default AuctionsRepository;