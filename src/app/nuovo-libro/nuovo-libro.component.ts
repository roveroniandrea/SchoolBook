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

declare var require: any

@Component({
  selector: 'app-nuovo-libro',
  templateUrl: './nuovo-libro.component.html',
  styleUrls: ['./nuovo-libro.component.css']
})
export class NuovoLibroComponent implements OnInit {
  uploadForm: FormGroup;
  //patternPrezzo = "^(?!0\.00)\d{1,3}(,\d{3})*(\.\d\d)?$";
  immagine: File; //l'immagine caricata
  //filePath: string;  //conterrà il percorso generato dall'uuid
  //imageRef: any;
  newLibro: any = {};
  progressoCaricamento = -1;
  uuidv4 = require('uuid/v4');
  idLibroDaURL: string;
  stoCercandoLibroDaModificare = false;
  stoCaricandoImmagine = false;
  pathNuovaFoto = "";
  urlNuovaFoto = "";
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
    this.newLibro.titolo = this.uploadForm.value.titolo;
    this.newLibro.isbn = this.uploadForm.value.isbn;
    this.newLibro.prezzo = this.uploadForm.value.prezzo;
    this.newLibro.descrizione = this.uploadForm.value.descrizione;   //aggiorno newLibro
    this.newLibro.id_utente = this.userService.utente.uid;

    if(this.pathNuovaFoto){
      console.log("cancello vecchia foto");
      this.storage.ref(this.newLibro.imagePath).delete();
    }
    this.newLibro.imagePath = this.pathNuovaFoto || this.newLibro.imagePath;
    this.newLibro.imageUrl = this.urlNuovaFoto || this.newLibro.imageUrl;
    const idLibro = this.newLibro.id || this.uuidv4(); //se il libro non ha un suoi id (quindi è nuovo), glielo imposto con uuid
    
    this.db.collection("books").doc(idLibro).set(this.newLibro)
      .catch(err => console.log(err))
      .then(resolve => {
        console.log("resolve", resolve);
        this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 1 } });
      })
  }

  annullaForm() {
    const dialogRef = this.matDialog.open(PerditaModificheComponent, { data: { titolo: "Uscire?", descrizione: "Confermando le modifiche andranno perse" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.pathNuovaFoto) {
          this.storage.ref(this.pathNuovaFoto).delete().subscribe(val => {
            this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 0 } });
          })
        }
        else {
          this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 0 } });
        }
      }
    })
  }
  /*
  ngOnInit() {
    this.idLibroDaURL = this.route.snapshot.queryParams.id_libro;
    if (this.idLibroDaURL) {
      this.stoCercandoLibroDaModificare = true;
      this.cercaLibro();
    }
    this.uploadForm = new FormGroup({
      "titolo": new FormControl("", Validators.required),
      "isbn": new FormControl(null, Validators.required),
      "prezzo": new FormControl("", Validators.required), //inserire pattern moneta
      "descrizione": new FormControl("", Validators.required)
    })
  }
  */
  /*
    submitForm() {
      //console.log(this.uploadForm);
      this.newLibro = <Libro>this.uploadForm.value;
      this.newLibro.id_utente = this.userService.utente.uid;
      this.newLibro.prezzo = <number>this.newLibro.prezzo;
      this.newLibro.titolo = this.newLibro.titolo.toLowerCase();    //titolo lowercase altrimenti ricerca catalogo non funziona
  
      this.progressoCaricamento = 0; //inizio il caricamento (scompare il form)
      this.caricaImmagineStorage();   //carico prima l'immagine
    }
  
    annullaForm() {
      const dialogRef = this.matDialog.open(PerditaModificheComponent,{data: {titolo: "Uscire?", descrizione : "Confermando le modifiche andranno perse"}});
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
            //console.log(result);
            this.caricaOMoficicaLibro();
  
          }, err => console.log("errore getDownloadUrl", err))
        }, err => {
          console.log("errore caricamento immagine", err);
          this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 2 } }); //se errore nel caricamento immagine torno a /account
        })
  
      }
      else {
        this.caricaOMoficicaLibro();   //se non è caricata un'immagine
      }
    }
  
    caricaLibro() {
      this.db.collection("books").add(this.newLibro)  //pubblico il libro
        .then(val => {
          //console.log(val);
          this.progressoCaricamento = 100;
          setTimeout(() => this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 1 } }), 1000);
  
        }, err => {
          this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 2 } });
        })
    }
  
    cercaLibro() {   //cerca il libro corrispondente all'url
      this.db.collection("books").doc(this.idLibroDaURL).valueChanges().subscribe(val => {
        this.stoCercandoLibroDaModificare = false;
        const libroCercato = <Libro>val;
        this.uploadForm.setValue({ "titolo": libroCercato.titolo, "isbn": libroCercato.isbn, "prezzo": libroCercato.prezzo, "descrizione": libroCercato.descrizione })
      })
    }
  
    modificaLibro() {
      this.db.collection("books").doc(this.idLibroDaURL).set(this.newLibro).then(
        result => {
          //console.log(result);
          this.progressoCaricamento = 100;
          setTimeout(() => this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 1 } }), 1000);
        },
        err => {
          //console.log(err),
          this.router.navigate(["/account"], { queryParams: { inserimentoLibro: 2 } });
        }
      )
    }
  
    caricaOMoficicaLibro(){   //qui si decide se il libro verrà aggiunto a db o modificato uno esistente
      this.progressoCaricamento = 66;
      if (!this.idLibroDaURL) { //se non sto modificando un libro
        //console.log("nuovo libro")
        this.caricaLibro(); //passo al caricamento libro
      }
      else {  //se sto modificando un libro
        //console.log("modifico libro")
        this.modificaLibro();
      }
    }
    */
}
