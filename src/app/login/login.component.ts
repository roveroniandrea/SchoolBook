import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../servizi/utente.service';
import * as firebase from "firebase";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: Error;

  constructor(private autenticazione: AngularFireAuth,
    private route: Router,
    private user: UserService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      "mail": new FormControl("", Validators.required),
      "password": new FormControl("", Validators.required),
    })
  }

  login() {
    this.autenticazione.auth.signInWithEmailAndPassword(this.loginForm.value.mail, this.loginForm.value.password)
      .catch(err => {
        console.log("Login Errato.", this.user.utente)
        this.error = err;
      })
      .then(result => {
        if (result) {
          console.log("Login Effettuato.", this.user.utente)
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
