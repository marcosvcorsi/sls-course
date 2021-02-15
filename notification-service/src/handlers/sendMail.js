import SendMailService from "../services/SendMailService";

const sendMailService = new SendMailService();

async function sendMail(event, context) {
  const [record] = event.Records;

  console.log('record processing', record);

  const email = JSON.parse(record.body);

  const { subject, message, to } = email;

  try {
    const result = await sendMailService.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      message
    });

    console.log(result);
  } catch(error) {
    console.error(error);
  }


  return event;
}

export const handler = sendMail;


