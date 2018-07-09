import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PerditaModificheComponent } from '../perdita-modifiche/perdita-modifiche.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { UserService } from '../servizi/utente.service';
import { AngularFireStorage } from 'angularfire2/storage';

declare var require: any

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
  newLibro: Libro;
  progressoCaricamento = -1;
  uuidv4 = require('uuid/v4');
  idLibroDaURL : string;
  constructor(private confermaUscita: MatDialog, private router: Router, private db: AngularFirestore, private userService: UserService, private storage: AngularFireStorage,private route : ActivatedRoute) { }

  ngOnInit() {
    this.idLibroDaURL = this.route.snapshot.params["id_libro"];
    if(this.idLibroDaURL){
      this.cercaLibro();
    }
    this.uploadForm = new FormGroup({
      "titolo": new FormControl("", Validators.required),
      "isbn": new FormControl(null, Validators.required),
      "prezzo": new FormControl("", Validators.required), //inserire pattern moneta
      "descrizione": new FormControl("", Validators.required)
    })
  }

  submitForm() {
    //console.log(this.uploadForm);
    this.newLibro = <Libro>this.uploadForm.value;
    this.newLibro.id_utente = this.userService.utente.id;
    this.newLibro.prezzo = <number>this.newLibro.prezzo;
    this.newLibro.titolo = this.newLibro.titolo.toLowerCase();    //titolo lowercase altrimenti ricerca catalogo non funziona

    this.progressoCaricamento = 0; //inizio il caricamento (scompare il form)
    this.caricaImmagineStorage();   //carico prima l'immagine
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
    if (this.immagine) {
      this.filePath = this.uuidv4();    //percorso random
      let upload = this.storage.upload(this.filePath, this.immagine)

      upload.percentageChanges().subscribe(percentage => {
        this.progressoCaricamento = percentage / 3;
      })

      upload.then(result => {
        this.progressoCaricamento = 33;
        result.ref.getDownloadURL().then(result => {  //una 
          this.newLibro.imageUrl = result;  //collego donloadUrl a propietà imageUrl del libro
          console.log(result);
          this.progressoCaricamento = 66;
          this.caricaLibro(); //passo al caricamento libro
        }, err => console.log("errore getDownloadUrl", err))
      }, err => {
        console.log("errore caricamento immagine", err);
        this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 2 } }); //se errore nel caricamento immagine torno a /account
      })

    }
    else {
      this.progressoCaricamento = 66;
      this.caricaLibro();   //se non è caricata un'immagine si passa direttamente al caricamento libro
    }
  }

  caricaLibro() {
    this.db.collection("books").add(this.newLibro)  //pubblico il libro
      .then(val => {
        console.log(val);
        this.progressoCaricamento = 100;
        setTimeout(() => this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 1 } }), 1000);

      }, err => {
        this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 2 } });
      })
  }

  cercaLibro(){   //cerca il libro corrispondente all'url
  this.db.collection("books").doc(this.idLibroDaURL).valueChanges().subscribe(val=>{
    console.log(val);
    //this.uploadForm.setValue({"titolo" : val.titolo})
  })
  }
}
