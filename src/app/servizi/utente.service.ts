import { Injectable } from '@angular/core';
import { Autore } from '../classe-autore/classe-autore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  utente = new Autore()
  constructor() {
    this.utente.id = "nckWTBnEvOFSvHbPXmKu"
    this.utente.nome = "pinco";
    this.utente.cognome = "pallino";
    this.utente.mail = "random@gsdfsd";
    this.utente.scuola = "scuolaACaso";
    this.utente.telefono = "+39 3532";
  }
}
