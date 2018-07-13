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
  error: Error;

  constructor(private autenticazione: AngularFireAuth,
    private route: Router) { }

  ngOnInit() {
    /* Creo il form */ 
    this.loginForm = new FormGroup({
      "mail": new FormControl("", Validators.required),
      "password": new FormControl("", Validators.required),
    })
  }

  /* Controllo i valori inseriti */
  login() {
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
