import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PerditaModificheComponent } from '../perdita-modifiche/perdita-modifiche.component';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { UserService } from '../servizi/utente.service';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
@Component({
  selector: 'app-nuovo-libro',
  templateUrl: './nuovo-libro.component.html',
  styleUrls: ['./nuovo-libro.component.css']
})
export class NuovoLibroComponent implements OnInit {
  uploadForm: FormGroup;
  patternPrezzo = "^(?!0\.00)\d{1,3}(,\d{3})*(\.\d\d)?$";
  immagine: File;
  filePath: string;  //conterrà il percorso generato dall'uuid
  imageRef: any;
  uuidv4 = require('uuid/v4');

  constructor(private confermaUscita: MatDialog, private router: Router, private db: AngularFirestore, private userService: UserService, private storage: AngularFireStorage) { }

  ngOnInit() {
    this.uploadForm = new FormGroup({
      "titolo": new FormControl("", Validators.required),
      "isbn": new FormControl(null, Validators.required),
      "prezzo": new FormControl("00.00", Validators.required), //inserire pattern moneta
      "descrizione": new FormControl("", Validators.required)
    })
  }

  submitForm() {
    //console.log(this.uploadForm);
    this.caricaImmagineStorage();
  }

  annullaForm() {
    const dialogRef = this.confermaUscita.open(PerditaModificheComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 0 } });
      }
    })
  }

  immagineCaricata(event) {
    this.immagine = <File>event.target.files[0];
  }

  caricaImmagineStorage() {
    this.filePath = this.uuidv4();
    let upload = this.storage.upload(this.filePath, this.immagine)
      .then(result => {
        console.log(result)
      }, err => {
        console.log("errore", err)
      })
  }

  caricaLibro() {
    let newLibro = <Libro>this.uploadForm.value;
    newLibro.id_utente = this.userService.utente.id;
    if(this.imageRef){
      newLibro.imageUrl = this.imageRef.getDownloadURL().subscribe();
    }
    this.db.collection("books").add(newLibro)
      .then(val => {
        this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 1 } });
      }, err => {
        this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 2 } });
      })
  }
}
