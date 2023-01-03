import sgMail from '@sendgrid/mail';
const api_key = 'somethingfortest'
sgMail.setApiKey(api_key);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'some@mail.com',
    subject: 'Thanks for joining in.',
    text: `Welcom to the app, ${name}. Let me know how you get along with the app.`
  })
}

export const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'some@mail.com',
    subject: 'Sorry to see you go.',
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`
  })
}

// export default sendWelcomeEmail