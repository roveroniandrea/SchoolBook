const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const APP_NAME = 'School Book';
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});
// [START sendWelcomeEmail]
/**
 * Sends a welcome email to new user.
 */
// [START onCreateTrigger]
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
    // [END onCreateTrigger]
      // [START eventAttributes]
      const email = user.email; // The email of the user.
      // [END eventAttributes]
    
      return sendWelcomeEmail(email);
    });
    // [END sendWelcomeEmail]


// Sends a welcome email to the given user.
function sendWelcomeEmail(email) {
    const mailOptions = {
      from: `${APP_NAME} <noreply@firebase.com>`,
      to: email,
      subject :`Welcome to ${APP_NAME}!`,
      text : `Ciao! Benvenuto su ${APP_NAME}, ora potrai vendere i tuoi libri e comprarne altri!`
    };
  
    return mailTransport.sendMail(mailOptions).then(() => {
      return console.log('Email di benvenuto spedita a: ', email);
    });
  }