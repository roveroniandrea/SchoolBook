import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PerditaModificheComponent } from '../perdita-modifiche/perdita-modifiche.component';
import { Router } from '@angular/router';
import { Autore } from '../classe-autore/classe-autore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserService } from '../servizi/utente.service';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})
export class RegistrazioneComponent implements OnInit {

  accountForm: FormGroup;
  nuovoUtente: Autore;
  error: Error;
  constructor(private matDialog: MatDialog,
    private router: Router,
    private autenticazione: AngularFireAuth,
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private userService : UserService
  ) { }

  ngOnInit() {
    this.accountForm = new FormGroup({
      "nome": new FormControl("", Validators.required),
      "cognome": new FormControl(""),
      "mail": new FormControl("", [Validators.required, Validators.email]),
      "telefono": new FormControl(""),
      "scuola": new FormControl("", Validators.required),
      "password": new FormControl("", Validators.required),
    })
  }

  submitAccount() {
    this.error = null;
    //console.log(this.accountForm.value);
    this.nuovoUtente = <Autore>this.accountForm.value;
    this.registraUtente();
  }

  annullaRegistrazione() {
    this.matDialog.open(PerditaModificheComponent, {
      data: {
        titolo: "Tornare alla home?",
        descrizione: "Continuando perderai i dati immessi"
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.router.navigateByUrl("/");
      }
    })
  }

  registraUtente() {
    this.autenticazione.auth.createUserWithEmailAndPassword(this.nuovoUtente.mail, this.accountForm.value.password)
      .catch(err => {
        this.error = err;
        //console.log("catch:"+this.error)
      })
      .then(resolve => {
        if (resolve) {
          console.log("utente creato");
          this.nuovoUtente.uid = resolve.user.uid;
          this.creaUtenteDatabase();
        }
      })
  }

  creaUtenteDatabase() {
    this.db.collection("users").doc(this.nuovoUtente.uid).set(this.nuovoUtente)
      .catch(err => {
        //console.log("err",err);
        this.snackBar.open("Errore imprevisto :(", "", { duration: 2000 });
      }
      )
      .then(result => {
        //console.log("result",result);
        this.router.navigate(["/account"], { queryParams: { utenteCreato: 1 } }).catch(err=>console.log("errore navigate ",err))
      })
  }
}
