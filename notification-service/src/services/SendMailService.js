import AWS from 'aws-sdk';

class SendMailService {
  constructor() {
    this.sender = new AWS.SES({
      region: process.env.MAIL_REGION || 'us-east-1'
    })
  }

  async sendMail({
    from,
    to,
    message,
    subject
  }) {
    const params = {
      Source: from,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Text: {
            Data: message
          }
        },
        Subject: {
          Data: subject
        }
      },
    };

    return this.sender.sendEmail(params).promise();
  }
}

export default SendMailService;