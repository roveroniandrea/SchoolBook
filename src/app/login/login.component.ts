import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  mail = "";
  password = "";
  user;
  constructor(private autenticazione: AngularFireAuth) {
    //console.log("faccio il login");
    /* ANONIMO
    autenticazione.auth.signInAnonymously().then(result=>{
      console.log("ora logout");
      autenticazione.auth.signOut();
    });
    */
   /*
    autenticazione.auth.onAuthStateChanged(user => {
      this.user = user;
      if(this.user){
        console.log("già loggato", this.user);
      }
      else{
        autenticazione.auth.signInWithEmailAndPassword("c@c.com", "123456")
        .catch(err=>console.log(err.message))
        .then(result=>{console.log("login fatto")});
      }
    })
    */
   autenticazione.auth.onAuthStateChanged(user=>{
     this.user = user;
     console.log(user);
   });
  }

  ngOnInit() {
  }

  login(){
    this.autenticazione.auth.signInWithEmailAndPassword(this.mail,this.password);
  }

  logout(){
    this.autenticazione.auth.signOut();
  }

  createAccount(){
    this.autenticazione.auth.createUserWithEmailAndPassword(this.mail,this.password);
  }
}
