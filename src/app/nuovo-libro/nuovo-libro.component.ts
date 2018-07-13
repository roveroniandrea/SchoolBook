import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PerditaModificheComponent } from '../perdita-modifiche/perdita-modifiche.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { UserService } from '../servizi/utente.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { LibroUrlService } from '../servizi/libro-url.service';
import { CanComponentDeactivate } from '../servizi/canDeactivate-guard.service';
import { Observable } from '../../../node_modules/rxjs';

declare var require: any

@Component({
  selector: 'app-nuovo-libro',
  templateUrl: './nuovo-libro.component.html',
  styleUrls: ['./nuovo-libro.component.css']
})
export class NuovoLibroComponent implements OnInit, CanComponentDeactivate {
  uploadForm: FormGroup;
  //patternPrezzo = "^(?!0\.00)\d{1,3}(,\d{3})*(\.\d\d)?$";
  immagine: File; //l'immagine caricata
  //filePath: string;  //conterrà il percorso generato dall'uuid
  //imageRef: any;
  newLibro: any = {}; //non rendere di classe Libro
  progressoCaricamento = -1;
  uuidv4 = require('uuid/v4');
  idLibroDaURL: string;
  stoCercandoLibroDaModificare = false;
  stoCaricandoImmagine = false;
  pathNuovaFoto = "";
  urlNuovaFoto = "";
  modificheEffettuate = false; //se true chiede prima di lasciare la pagina

  constructor(private matDialog: MatDialog,
    private router: Router,
    private db: AngularFirestore,
    private userService: UserService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private libroUrlService: LibroUrlService
  ) { }

  ngOnInit() {
    this.idLibroDaURL = this.route.snapshot.queryParams.id_libro;
    if (this.idLibroDaURL) {
      this.stoCercandoLibroDaModificare = true;   //mostro mat-spinner
      this.cercaLibro();
    }
    this.uploadForm = new FormGroup({
      "titolo": new FormControl("", Validators.required),
      "isbn": new FormControl(null, Validators.required),
      "prezzo": new FormControl("", Validators.required), //inserire pattern moneta
      "descrizione": new FormControl("", Validators.required)
    })
  }

  cercaLibro() {       //cerco il libro con id passato da queryParams
    this.db.collection("books").doc(this.idLibroDaURL).snapshotChanges().subscribe(val => {
      this.newLibro = <Libro>val.payload.data();
      this.newLibro.id = val.payload.id;
      this.uploadForm.setValue({
        "titolo": this.newLibro.titolo,
        "isbn": this.newLibro.isbn,
        "prezzo": this.newLibro.prezzo,
        "descrizione": this.newLibro.descrizione
      });
      this.stoCercandoLibroDaModificare = false;
    })
  }

  immagineSelezionata(event) {
    this.immagine = <File>event.target.files[0];
    //this.newLibro.imagePath = this.newLibro.imagePath || this.uuidv4();     //se imagePath del libro è vuoto (nessuna immagine) lo imposto casualmente
    this.pathNuovaFoto = this.uuidv4();
    this.stoCaricandoImmagine = true;
    console.log("carico immagine con url", this.pathNuovaFoto)
    this.storage.upload(this.pathNuovaFoto, this.immagine)
      .catch(err => console.log(err))
      .then(resolve => {
        if (resolve) {
          this.storage.ref(this.pathNuovaFoto).getDownloadURL().subscribe(val => {
            this.urlNuovaFoto = val;
            this.stoCaricandoImmagine = false;
            console.log("immagine caricata con url", this.urlNuovaFoto)
          })
        }
      })
  }

  submitForm() {
    //console.log("submit")
    this.newLibro.titolo = this.uploadForm.value.titolo;
    this.newLibro.isbn = this.uploadForm.value.isbn;
    this.newLibro.prezzo = this.uploadForm.value.prezzo;
    this.newLibro.descrizione = this.uploadForm.value.descrizione;   //aggiorno newLibro
    this.newLibro.id_utente = this.userService.utente.uid;

    let data = Date.now();
    this.newLibro.data = data;

    if (this.pathNuovaFoto && this.newLibro.imagePath) {  //se c'è una nuova foto e il libro ne ha una vecchia
      console.log("cancello vecchia foto");
      this.storage.ref(this.newLibro.imagePath).delete();
    }
    this.newLibro.imagePath = this.pathNuovaFoto || this.newLibro.imagePath || "";   //Aggiungo "" per evitare errori con undefined
    this.newLibro.imageUrl = this.urlNuovaFoto || this.newLibro.imageUrl || "";
    const idLibro = this.newLibro.id || this.uuidv4(); //se il libro non ha un suoi id (quindi è nuovo), glielo imposto con uuid
    delete this.newLibro.id;
    console.log(this.newLibro);
    this.db.collection("books").doc(idLibro).set(this.newLibro)
      .catch(err => console.log(err))
      .then(resolve => {
        //console.log("resolve", resolve);
        this.modificheEffettuate = false;
        this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 1 } });
      })
  }

  annullaForm() {
    this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 0 } });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    let _self = this;

    console.log(_self.modificheEffettuate);
    return new Promise(function(resolve,reject){
      if (_self.modificheEffettuate) {  //se ci sono modifiche in corso chiedo se vuole uscire
        const dialogRef = _self.matDialog.open(PerditaModificheComponent, { data: { titolo: "Uscire?", descrizione: "Confermando le modifiche andranno perse" } });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {  //se ho confermato l'uscita cancello l'eventuale foto caricata
            if (_self.pathNuovaFoto) {
              _self.storage.ref(_self.pathNuovaFoto).delete().subscribe(val => {
                resolve(true);
              })
            }
            else {
              resolve(true);
            }
          }
          else{
            resolve(false);
          }
        })
      }
      else {
        resolve(true);
      }
    })
  }

  onChange() {
    this.modificheEffettuate = true;
  }
}
