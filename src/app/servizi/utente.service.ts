import { Injectable } from '@angular/core';
import { Autore } from '../classe-autore/classe-autore';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  utente = new Autore()

  constructor(private autenticazione: AngularFireAuth, 
    private database: AngularFirestore) {

    this.autenticazione.auth.onAuthStateChanged(user => {
      this.utente.mail = user && user.email;
      this.utente.uid = user && user.uid;
      if (user) {
        this.database.collection("users").doc(this.utente.uid).valueChanges().subscribe(val => {
          let datiUtente = <Autore>val;
          if (datiUtente) {
            this.utente.nome = datiUtente.nome;
            this.utente.cognome = datiUtente.cognome;
            this.utente.scuola = datiUtente.scuola;
            this.utente.telefono = datiUtente.telefono;
            this.utente.preferiti = datiUtente.preferiti;
          }
          else {
            this.utente.nome = null;
            this.utente.cognome = null;
            this.utente.scuola = null;
            this.utente.telefono = null;
            this.utente.preferiti = null;
          }
        })
      }
    })
  }

  verificaStatoUtente() {
    const _self = this;
    const promise = new Promise(
      function (resolve, reject) {
        _self.autenticazione.auth.onAuthStateChanged(user => {
          resolve(user);
        })
      }
    )
    return promise;
  }
}
