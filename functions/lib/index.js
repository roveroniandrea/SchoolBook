'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
//import * as functions from "firebase-functions";
const functions = require("firebase-functions");
//import { nodemailer } from "nodemailer";
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
        from: `<noreply@firebase.com>`,
        to: email,
        subject: `Benvenuto su ${APP_NAME}!`,
        text: `Ciao! Benvenuto su ${APP_NAME}, ora potrai vendere i tuoi libri e comprarne altri!`
    };
    return mailTransport.sendMail(mailOptions).then(() => {
        return console.log('Email di benvenuto spedita a: ', email);
    });
}
//funzione per contattare l'utente
exports.contattaUtente = functions.https.onRequest((req, res) => {
    //set JSON content type and CORS headers for the response
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const mailOptions = {
        from: "<noreply@firebase.com>",
        to: req.body.mailDestinatario,
        subject: "Qualcuno è interessato al tuo libro " + req.body.titoloLibro + "!",
        text: "Ciao " + req.body.nomeDestinatario + "!"
            + "\n" + req.body.nomeMittente + " è interessato al tuo libro e ti ha scritto:\n" +
            req.body.testo + "\n Contattalo: " + req.body.mailMittente
    };
    if (req.method == "POST") { //se è metodo post (no options)
        return mailTransport.sendMail(mailOptions)
            .then(() => {
            res.send({
                error: "",
                message: "Email inviata"
            });
            return console.log('Richiesta di contatto spedita a: ', req.body.mailDestinatario);
        });
    }
    else {
        res.send({
            error: "OPTIONS",
            message: "Email inviata"
        });
        return console.log("Bloccato metodo sbagliato: " + req.method);
    }
});
//# sourceMappingURL=index.js.map