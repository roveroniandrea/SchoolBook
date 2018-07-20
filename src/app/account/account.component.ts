import { Component, OnInit } from '@angular/core';
import { UserService } from '../servizi/utente.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { LibroUrlService } from '../servizi/libro-url.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '../../../node_modules/@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { PerditaModificheComponent } from '../perdita-modifiche/perdita-modifiche.component';
import { PaginatorService } from '../servizi/paginator.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  // Variabili
  inserimentoLibro = null;
  mode = "see";
  accountForm: FormGroup;
  myBooks: Libro[] = [];
  myBooksDisplay: Libro[] = [];
  stoModificandoUtente = false; //impostato a true quando l'update su firebase è in corso (disabilita i pulsanti)
  user = this.autenticazione.auth.currentUser;
  numRisultatiDaMostrare = 16;
  paginaCorrente = 1;
  nPages = [1, 2, 3, 4, 5];

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private database: AngularFirestore,
    private libroUrlService: LibroUrlService,
    private snackBar: MatSnackBar,
    private autenticazione: AngularFireAuth,
    private matDialog: MatDialog,
    private router: Router,
    private paginatorService: PaginatorService) {
    this.inserimentoLibro = this.route.snapshot.queryParams.inserimentoLibro;
    this.controllaUtenteCreato(this.route.snapshot.queryParams.utenteCreato); //se l'utente è stato creato faccio comparire uno snack bar
    this.controllaUploadLibro();

    //controllo se ho il queryParam libroEliminato
    const libroEliminato = this.route.snapshot.queryParams.libroEliminato;
    if (libroEliminato == 0) {
      this.snackBar.open("Errore durante l'eliminazione del libro", "", { duration: 5000 });
    }
    if (libroEliminato == 1) {
      this.snackBar.open("Libro eliminato correttamente", "", { duration: 5000 });
    }

    paginatorService.isHandset$.subscribe(val => {
      if (val) {
        this.numRisultatiDaMostrare = 6;
      }
      else {
        this.numRisultatiDaMostrare = 8;
      }
      this.cambiaPagina(this.paginaCorrente);
    });
  }

  ngOnInit() {
    this.accountForm = new FormGroup({
      "nome": new FormControl("", Validators.required),
      "cognome": new FormControl(""),
      //"mail": new FormControl(this.userService.utente.mail, [Validators.required, Validators.email]),
      "telefono": new FormControl(""),
      "scuola": new FormControl(""),
    })
    this.cercaMieiLibri();
  }

  submitAccount() {
    this.stoModificandoUtente = true;
    const utenteModificato = this.accountForm.value;
    this.database.collection("users").doc(this.userService.utente.uid).update(utenteModificato)
      .catch(error => {
        this.stoModificandoUtente = false;
      })
      .then(result => {
        this.stoModificandoUtente = false;
        this.mode = "see";
      })
  }

  cercaMieiLibri() {
    this.database.collection("books", ref => ref.where("id_utente", "==", this.userService.utente.uid)).snapshotChanges().subscribe(val => {
      this.myBooks = val.map(item => {
        const libro = <Libro>{ id: item.payload.doc.id, ...item.payload.doc.data() }
        return this.libroUrlService.setLibroUrl(libro);
      });
      this.cambiaPagina(this.paginaCorrente);
    })
  }

  controllaUploadLibro() {
    if (this.inserimentoLibro != null) {
      if (this.inserimentoLibro == 0) {
        this.snackBar.open("Caricamento libro annullato", "", { duration: 2000 })
      }
      if (this.inserimentoLibro == 1) {
        this.snackBar.open("Libro caricato correttamente!", "", { duration: 2000 })
      }
      if (this.inserimentoLibro == 2) {
        this.snackBar.open("Errore nel caricamento del libro :(", "", { duration: 2000 })
      }
    }
  }

  controllaUtenteCreato(queryParam) {
    if (queryParam == 1) {
      this.snackBar.open("Utente creato correttamente", "", { duration: 2000 });
    }
  }

  eliminaAccount() {
    const dialogRef = this.matDialog.open(PerditaModificheComponent, { data: { titolo: "Conferma elimininazione account!", descrizione: "Confermando si perderanno tutti i dati salvati." } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigateByUrl("/");
        //elimina dati in books e restore
        this.eliminaLibriImmagini(this.myBooks.length);
      }
    })
  }

  //elimina dati in books e restore
  eliminaLibriImmagini(lunghezza) {
    if (lunghezza > 0) {
      lunghezza--;
      this.libroUrlService.eliminaLibro(this.myBooks[lunghezza].id, this.myBooks[lunghezza].imagePath)
        .catch(error => {
          this.snackBar.open("Errore durante l'eliminazione dei libri.", "", { duration: 2000 });
        })
        .then(result => {
          this.eliminaLibriImmagini(lunghezza);
        })
    } else {
      //elimina dati in users
      this.eliminaUsers();
    }
  }

  //elimina dati in users
  eliminaUsers() {
    this.database.collection("users").doc(this.userService.utente.uid).delete()
      .catch(error => {
        this.snackBar.open("Errore durante l'eliminazione dello user.", "", { duration: 2000 });
      })
      .then(result => {
        //elimina dati in autentificazione
        this.eliminaAuthentication();
      })
  }

  //elimina dati in autentificazione
  eliminaAuthentication() {
    this.user.delete()
      .catch(error => {
        this.snackBar.open("Errore durante l'eliminazione dell'authentication", "", { duration: 2000 });
      })
      .then(result => {
        this.snackBar.open("Eliminazione effettuata con successo", "", { duration: 2000 });
      });
  }

  modificaDati() {
    this.mode = "edit";
    this.accountForm.setValue({
      "nome": this.userService.utente.nome,
      "cognome": this.userService.utente.cognome,
      "telefono": this.userService.utente.telefono,
      "scuola": this.userService.utente.scuola
    })
  }

  modificaPassword() {
    let desc = "Il link verrà inviato alla seguente mail: " + this.userService.utente.mail + ".";
    const dialogRef = this.matDialog.open(PerditaModificheComponent, { data: { titolo: "Conferma modifica password!", descrizione: desc } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.autenticazione.auth.sendPasswordResetEmail(this.userService.utente.mail)
          .catch(error => {
            this.snackBar.open("Errore durante l'invio della mail", "", { duration: 2000 });
          })
          .then(result => {
            this.snackBar.open("Mail inviata", "", { duration: 2000 });
          })
      }
    })
  }

  cambiaPagina(num) {
    this.paginaCorrente = num;
    this.myBooksDisplay = this.paginatorService.impostaPaginaCorrente(<any[]>this.myBooks, this.paginaCorrente, this.numRisultatiDaMostrare);
  }
}