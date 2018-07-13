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
  constructor(private autenticazione: AngularFireAuth, private db: AngularFirestore) {
    autenticazione.auth.onAuthStateChanged(user => {
      this.utente.mail = user && user.email;
      this.utente.uid = user && user.uid;
      //console.log("cerco utente");
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
      console.log("utente cambiato: ", this.utente);
    })
  }

  verificaStatoUtente() {
    const _self = this;
    const promise = new Promise(
      function (resolve, reject) {
        _self.autenticazione.auth.onAuthStateChanged(user=>{
          resolve(user);
        })
      }
    )
    return promise;
  }
/*
  verificaStatoUtente2() {
    return this.utente;
  }
  */
}
