import AWS from 'aws-sdk';

class SendMailService {
  constructor() {
    this.sender = new AWS.SES({
      region: 'us-east-1'
    })

    this.from = 'noreply@marcoscorsi.com'
  }

  async sendMail(email) {
    const params = {
      Source: this.from,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: {
            Data: 'Hello from SLS'
          }
        },
        Subject: {
          Data: 'Test Mail'
        }
      },
    };

    try {
      const result = await this.sender.sendEmail(params).promise();

      console.log(result);

      return result;
    } catch(error) {
      console.error(error);
    }
  }
}

export default SendMailService;