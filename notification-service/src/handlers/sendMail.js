import SendMailService from "../services/SendMailService";

const sendMailService = new SendMailService();

async function sendMail(event, context) {
  console.log(event);

  await sendMailService.sendMail('marcosvcorsi@gmail.com');

  return event;
}

export const handler = sendMail;


