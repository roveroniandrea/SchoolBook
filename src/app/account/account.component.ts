import { Component, OnInit } from '@angular/core';
import { UserService } from '../servizi/utente.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { LibroUrlService } from '../servizi/libro-url.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  inserimentoLibro = null;
  mode = "see";
  accountForm: FormGroup;
  myBooks: Libro[];
  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private db: AngularFirestore, private libroUrlService: LibroUrlService, private snackBar: MatSnackBar) {
    this.inserimentoLibro = this.route.snapshot.queryParams.inserimentoLibro;
    this.controllaUtenteCreato(this.route.snapshot.queryParams.utenteCreato); //se l'utente è stato creato faccio comparire uno snack bar
    this.controllaUploadLibro();
  }

  ngOnInit() {
    this.accountForm = new FormGroup({
      "nome": new FormControl(this.userService.utente.nome, Validators.required),
      "cognome": new FormControl(this.userService.utente.cognome),
      "mail": new FormControl(this.userService.utente.mail, [Validators.required, Validators.email]),
      "telefono": new FormControl(this.userService.utente.telefono),
      "scuola": new FormControl(this.userService.utente.scuola, Validators.required),
    })

    this.cercaMieiLibri();
  }

  submitAccount() {
    console.log("submitted", this.accountForm.value);
    this.mode = "see";
  }

  cercaMieiLibri() {
    this.db.collection("books", ref => ref.where("id_utente", "==", this.userService.utente.uid)).snapshotChanges().subscribe(val => {
      this.myBooks = val.map(item => {
        const libro = <Libro>{ id: item.payload.doc.id, ...item.payload.doc.data() }
        return this.libroUrlService.setLibroUrl(libro);
      });
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

  controllaUtenteCreato(queryParam){
    if(queryParam == 1){
      this.snackBar.open("Utente creato correttamente", "", { duration: 2000 });
    }
  }
}
