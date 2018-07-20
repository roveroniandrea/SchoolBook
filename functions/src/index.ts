'use strict';
//import * as functions from "firebase-functions";
import functions = require('firebase-functions');
//var admin = require('firebase-admin');
import admin = require("firebase-admin");
const nodemailer = require('nodemailer');
/*
const mailgun = require("mailgun-js")({   //FIREBASE BLOCCA LE API ESTERNE SE ACCOUNT FREE Error: getaddrinfo ENOTFOUND
  apiKey : "8889127d-30f519c0",
  domain: "www.school-book-an.random-domain.com"
});
*/
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

exports.sendWelcomeEmail = functions.auth.user().onCreate((user: any) => {
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
 /*
 return mailgun.messages().send(mailOptions, function (error, body) {
  console.log("Email di benvenuto inviata",body,". Errori: ",error);
});
*/
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
    subject: "Qualcuno è interessato al tuo libro "+req.body.titoloLibro+"!",
    text: "Ciao " + req.body.nomeDestinatario + "!"
      +"\n"+req.body.nomeMittente+" è interessato al tuo libro e ti ha scritto il seguente messaggio:\n"+
      req.body.testo+"\nPuoi contattarlo al seguente indirizzo: "+req.body.mailMittente
  };

  if(req.method =="POST"){  //se è metodo post (no options)
    return mailTransport.sendMail(mailOptions)
    .then(() => {
      res.send({
        error : "",
        message : "Email inviata"
      });
      return console.log('Richiesta di contatto spedita a: ', req.body.mailDestinatario);
    });
   /*
   return mailgun.messages().send(mailOptions, function (error, body) {
     if(error){
      res.send({
        error : "Errore nell'invio: "+error,
        message : ""
      });
     }
     else{
      res.send({
        error : "",
        message : "Email inviata"
      });
     }
    console.log("Email di contatto inviata",body,". Errori: ",error);
  });
  */
  }
  else{
    res.send({
      error : "OPTIONS",
      message : "Email inviata"
    });
    return console.log("Bloccato metodo sbagliato: "+req.method);
  }
})

exports.impostaDataLibro = functions.firestore.document("books/{id}").onCreate((snapshot,context)=>{
  const data = admin.firestore.FieldValue.serverTimestamp();
  return snapshot.ref.update({data})
  .catch(err=>console.log("errore",err))
  .then(res=>console.log("funziona"))
})