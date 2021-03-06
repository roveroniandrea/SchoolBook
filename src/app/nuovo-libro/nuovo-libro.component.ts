import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PerditaModificheComponent } from '../perdita-modifiche/perdita-modifiche.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { UserService } from '../servizi/utente.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { CanComponentDeactivate } from '../servizi/canDeactivate-guard.service';
import { Observable } from '../../../node_modules/rxjs';
import { ValidatorInteger } from '../servizi/only-number.validator';
import { LibroUrlService } from '../servizi/libro-url.service';

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
  newLibro: any = {}; //non rendere di classe Libro
  progressoCaricamento = -1;
  uuidv4 = require('uuid/v4');
  idLibroDaURL: string;
  stoCercandoLibroDaModificare = false;
  stoCaricandoImmagine = false;
  pathNuovaFoto = "";
  urlNuovaFoto = "";
  pathVecchiaFoto = "";  //path e url della foto originale quando viene rimossa
  urlVecchiaFoto = "";
  isAutorizzato = false; //è impostato a true solo se il libro è nuovo oppure l'utente corrisponde all'autore

  modificheEffettuate = false; //se true chiede prima di lasciare la pagina

  constructor(private matDialog: MatDialog,
    private router: Router,
    private database: AngularFirestore,
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
    else{
      this.isAutorizzato = true; //è un nuovo libro quindi viene autorizzato
    }
    this.uploadForm = new FormGroup({
      "titolo": new FormControl("", Validators.required),
      "isbn": new FormControl(null, Validators.required),
      "prezzo": new FormControl(0, [Validators.required, Validators.min(1), Validators.max(99), ValidatorInteger]), //inserire pattern moneta
      "descrizione": new FormControl("", Validators.required)
    })
  }

  cercaLibro() {       //cerco il libro con id passato da queryParams
    this.database.collection("books").doc(this.idLibroDaURL).snapshotChanges().subscribe(val => {
      this.newLibro = <Libro>val.payload.data();
      this.newLibro.id = val.payload.id;
      this.uploadForm.setValue({
        "titolo": this.newLibro.titolo,
        "isbn": this.newLibro.isbn,
        "prezzo": this.newLibro.prezzo,
        "descrizione": this.newLibro.descrizione
      });
      //console.log("id libro: "+this.newLibro.id_utente + " id utente:"+this.userService.utente.uid,this.newLibro.id_utente == this.userService.utente.uid)
      if(this.newLibro.id_utente == this.userService.utente.uid){
        this.isAutorizzato = true;
      }
      else{
        this.isAutorizzato = false;
        this.router.navigateByUrl("/");   //se gli id non corrispondono non è lo stesso utente e viene reindirizzato
      }
      this.stoCercandoLibroDaModificare = false;
    })
  }

  immagineSelezionata(event) {         //quando carico una foto sull'applicazione
    this.immagine = <File>event.target.files[0];
    this.pathNuovaFoto = this.pathNuovaFoto || this.uuidv4();     //se pathNuovaFoto vale qualcosa vuol dire che ho già caricato una foto precedentemente, e sostituisco quindi quella nuova
    this.stoCaricandoImmagine = true;
    this.storage.upload(this.pathNuovaFoto, this.immagine)
      .catch(error => {})
      .then(result => {
        if (result) {
          this.storage.ref(this.pathNuovaFoto).getDownloadURL().subscribe(val => {
            this.urlNuovaFoto = val;
            this.stoCaricandoImmagine = false;
          })
        }
      })
  }

  submitForm() {
    this.newLibro.titolo = this.uploadForm.value.titolo.toLowerCase();
    this.newLibro.isbn = this.uploadForm.value.isbn;
    this.newLibro.prezzo = (<number>this.uploadForm.value.prezzo);
    this.newLibro.descrizione = this.uploadForm.value.descrizione;   //aggiorno newLibro
    this.newLibro.id_utente = this.userService.utente.uid;

    if (this.pathNuovaFoto && this.newLibro.imagePath) {  //se c'è una nuova foto e il libro ne ha una vecchia
      this.storage.ref(this.newLibro.imagePath).delete();
    }

    if (this.pathVecchiaFoto) {  //se c'è una vecchia foto (cioè l'originale rimossa)
      this.storage.ref(this.pathVecchiaFoto).delete();
    }

    this.newLibro.imagePath = this.pathNuovaFoto || this.newLibro.imagePath || "";   //Aggiungo "" per evitare errori con undefined
    this.newLibro.imageUrl = this.urlNuovaFoto || this.newLibro.imageUrl || "";
    const idLibro = this.newLibro.id || this.uuidv4(); //se il libro non ha un suoi id (quindi è nuovo), glielo imposto con uuid
    delete this.newLibro.id;
    this.database.collection("books").doc(idLibro).set(this.newLibro)
      .catch(error => {})
      .then(result => {
        this.modificheEffettuate = false;
        this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 1 } });
      })
  }

  annullaForm() {
    this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 0 } });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    let _self = this;

    return new Promise(function (resolve, reject) {
      if (_self.modificheEffettuate) {  //se ci sono modifiche in corso chiedo se vuole uscire
        const dialogRef = _self.matDialog.open(PerditaModificheComponent, { data: { titolo: "Conferma uscita!", descrizione: "Confermando le modifiche andranno perse" } });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {  //se ho confermato l'uscita cancello l'eventuale foto caricata
            if (_self.pathNuovaFoto) {
              _self.storage.ref(_self.pathNuovaFoto).delete().toPromise()
                .catch(error => {})
                .then(result => {
                  resolve(_self.reimpostaVecchiaFoto());
                })
            }
            else {
              resolve(_self.reimpostaVecchiaFoto());
            }
          }
          else {
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

  rimuoviImmagine() {    //quando voglio liminare una foto che ho caricato
    this.modificheEffettuate = true;
    if (this.pathNuovaFoto) {   //ha la priorità la foto appena caricata
      this.storage.ref(this.pathNuovaFoto).delete().toPromise()
        .catch(error => {})
        .then(result => {
          this.pathNuovaFoto = null;
          this.urlNuovaFoto = null;
        })
    }
    else {    //se non ho caricato nessun foto vuol dire che voglio rimuovere quella già esistente
      if (this.newLibro && this.newLibro.imagePath) {
        this.pathVecchiaFoto = this.newLibro.imagePath;
        this.urlVecchiaFoto = this.newLibro.imageUrl;
        this.newLibro.imagePath = "";
        this.newLibro.imageUrl = "";
      }
    }
  }

  reimpostaVecchiaFoto() {   //chiamato quando ho confermato di voler uscire senza salvare
    this.newLibro.imagePath = this.pathVecchiaFoto || this.newLibro.imagePath;
    this.newLibro.imageUrl = this.urlVecchiaFoto || this.newLibro.imageUrl;
    return true;
  }
}