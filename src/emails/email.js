import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv'
dotenv.config()

sgMail.setApiKey(process.env.api_key);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'example@mail.com',
    subject: `Thanks for joining in.`,
    text: `Welcom to the app, ${name}. Let me know how you get along with the app.`
  })
}

export const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'example@mail.com',
    subject: `Sorry to see you go. Actually this mail has to be send to the ${email}`,
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`
  })
}

export default sendWelcomeEmail