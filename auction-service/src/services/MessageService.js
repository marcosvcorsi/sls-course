import AWS from 'aws-sdk';

class MessageService {
  constructor() {
    this.sender = new AWS.SQS();
  }

  async sendMessage({ queue, message }) {
    return this.sender.sendMessage({
      QueueUrl: queue,
      MessageBody: message
    }).promise();
  }
}

export default MessageService;