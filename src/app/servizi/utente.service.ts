import { Injectable } from '@angular/core';
import { Autore } from '../classe-autore/classe-autore';
import { FirebaseAuth } from 'angularfire2';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  utente = new Autore()
  //autenticazione : FirebaseAuth;
  constructor(private autenticazione : AngularFireAuth, private db : AngularFirestore) {
    /*
    this.utente.uid = "nckWTBnEvOFSvHbPXmKu"
    this.utente.nome = "pinco";
    this.utente.cognome = "pallino";
    this.utente.mail = "c@c.com";
    this.utente.scuola = "scuolaACaso";
    this.utente.telefono = "+39 3532";
    */
    autenticazione.auth.onAuthStateChanged(user => {
      this.utente.mail = user && user.email;
      this.utente.uid = user && user.uid;
      console.log("cerco");
      if (user) {
        db.collection("users").doc(this.utente.uid).valueChanges().subscribe(val => {
          let datiUtente = <Autore>val;
          console.log(datiUtente);
          this.utente.nome = datiUtente.nome;
          this.utente.cognome = datiUtente.cognome;
          this.utente.scuola = datiUtente.scuola;
          this.utente.telefono = datiUtente.telefono;
          this.utente.preferiti = datiUtente.preferiti;
        })
      }
      console.log("utente cambiato: ",this.utente);
    })
  }
}
