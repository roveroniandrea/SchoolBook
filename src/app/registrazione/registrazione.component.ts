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

  /* Variabili */
  accountForm: FormGroup;
  nuovoUtente: Autore;
  error: Error;
  registrazioneInCorso = false;

  constructor(private matDialog: MatDialog,
    private router: Router,
    private autenticazione: AngularFireAuth,
    private database: AngularFirestore,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    /* Creo il form */
    this.accountForm = new FormGroup({
      "nome": new FormControl("", Validators.required),
      "cognome": new FormControl(""),
      "mail": new FormControl("", [Validators.required, Validators.email]),
      "telefono": new FormControl(""),
      "scuola": new FormControl(""),
      "password": new FormControl("", Validators.required),
    })
  }

  submitAccount() {
    /* Setto nessun errore, faccio partire lo spinner e creo l'utente, poi lo registro */
    this.error = null;
    this.registrazioneInCorso = true;
    this.nuovoUtente = <Autore>this.accountForm.value;
    this.registraUtente();
  }

  annullaRegistrazione() {
    /* Se preme annulla appare il matDialog */
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
    /* Creo l'authentication del mio utente */
    this.autenticazione.auth.createUserWithEmailAndPassword(this.nuovoUtente.mail, this.accountForm.value.password)
      .catch(error => {
        this.error = error;
        this.registrazioneInCorso = false;
      })
      .then(result => {
        if (result) {
          this.nuovoUtente.uid = result.user.uid;
          this.creaUtenteDatabase();
        }
      })
  }

  creaUtenteDatabase() {
    /* Creo lo user nel mio database */
    this.database.collection("users").doc(this.nuovoUtente.uid).set(this.nuovoUtente)
      .catch(error => {
        this.registrazioneInCorso = false;
        this.snackBar.open("Errore imprevisto :(", "", { duration: 2000 });
      }
      )
      .then(result => {
        this.registrazioneInCorso = false;
        this.router.navigate(["/account"], { queryParams: { utenteCreato: 1 } })
      })
  }
}
