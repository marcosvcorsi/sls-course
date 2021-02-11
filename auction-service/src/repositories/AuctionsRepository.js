import AWS from 'aws-sdk';

const TableName = 'AuctionsTable';

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
}

export default AuctionsRepository;