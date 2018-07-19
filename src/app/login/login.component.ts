import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import * as firebase from "firebase";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  /* Variabili */
  loginForm: FormGroup;
  recuperoForm: FormGroup;
  error: Error;
  errorRecuperoPassword: Error;
  passwordDimenticata = false;  //cambia tra il form di login e il form di recupero password
  stoInviandoRichiestaRecupero = false;

  constructor(private autenticazione: AngularFireAuth,
    private route: Router,
  ) { }

  ngOnInit() {
    /* Creo il form di login*/
    this.loginForm = new FormGroup({
      "mail": new FormControl("", [Validators.required, Validators.email]),
      "password": new FormControl("", Validators.required),
    })
    /* Creo il form di recupero password*/
    this.recuperoForm = new FormGroup({
      "mail": new FormControl("", [Validators.required, Validators.email]),
    })
  }

  /* Controllo i valori inseriti */
  login() {
    this.error = new Error();
    this.autenticazione.auth.signInWithEmailAndPassword(this.loginForm.value.mail, this.loginForm.value.password)
      .catch(error => {
        this.error = error;
      })
      .then(result => {
        if (result) {
          this.route.navigate(["/"], { queryParams: { "utenteLoggato": 1 } });
        }
      })
  }

  recuperaPassword() {
    this.stoInviandoRichiestaRecupero = true;
    this.errorRecuperoPassword = null;
    const mail = this.recuperoForm.value.mail;
    this.autenticazione.auth.sendPasswordResetEmail(mail)
      .catch(error => {
        this.errorRecuperoPassword = error;
        this.stoInviandoRichiestaRecupero = false;
      })
      .then(result => {
        //console.log("iviato", this.errorRecuperoPassword)
        if (!this.errorRecuperoPassword) {  //result è sempre undefined, controllo se non ci sono errori
          this.stoInviandoRichiestaRecupero = false;
          this.route.navigate(["/"], { queryParams: { "utenteLoggato": 2 } });
        }
      })
  }
  /* GOOGLE login
    google() {
      this.autenticazione.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider)
      .catch(err=>{
        console.log(err);
      })
      .then(user=>{
        console.log(user);
      })
    }
  */
}
