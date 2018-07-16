import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { Autore } from '../classe-autore/classe-autore';
import { LibroUrlService } from '../servizi/libro-url.service';
import { UserService } from '../servizi/utente.service';
import { MatDialog } from '@angular/material';
import { PerditaModificheComponent } from '../perdita-modifiche/perdita-modifiche.component';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-info-libro',
  templateUrl: './info-libro.component.html',
  styleUrls: ['./info-libro.component.css']
})

export class InfoLibroComponent implements OnInit {
  idLibro: string;
  libro: Libro = new Libro();
  autore: Autore = new Autore();
  isProprietario = false;
  preferiti: string[];
  isPreferiti = true;
  eliminazioneInCorso = false;
  libroNonTrovato = false;

  constructor(private route: ActivatedRoute,
    private database: AngularFirestore,
    private libroUrlService: LibroUrlService,
    private userService: UserService,
    private matDialog: MatDialog,
    private router: Router,
    private storage: AngularFireStorage,
  ) { }
  //todo modificare subbmit

  ngOnInit() {
    this.idLibro = this.route.snapshot.params.id;   //ottengo l'id del libro dai query params. Lo uso per ottenere info sul libro
    this.database.collection("books").doc(this.idLibro)  //cerco un libro con quell'id
      .valueChanges().subscribe(val => {
        if (val) { //uso un controllo per verificare se il libro esiste ancora e non è stato eliminato
          this.libro = this.libroUrlService.setLibroUrl(<Libro>val);
          //console.log(this.libro.id_utente);
          this.cercaAutore();
          this.cercaPreferito();
        }
        else {
          this.libroNonTrovato = true;
        }
      })
  }

  cercaAutore() {
    if (this.libro.id_utente) {
      this.database.collection("users").doc(this.libro.id_utente)
        .snapshotChanges().subscribe(val => {
          const id = val.payload.id;
          this.autore = <Autore>{ uid: id, ...val.payload.data() };
          //console.log(this.autore);
          this.confrontaUtenti();
        })
    }
  }

  confrontaUtenti() {    //confronta l'utente loggato e chi ha publicato il libro per vedere se corrispondono
    if (this.autore != null && this.userService.utente != null && this.autore.mail == this.userService.utente.mail) {
      this.isProprietario = true;
    }
    else {
      this.isProprietario = false;
    }
  }

  eliminaLibro() {  //apre mat dialog per conferma
    const dialogRef = this.matDialog.open(PerditaModificheComponent, { data: { titolo: "Conferma elimininazione libro!", descrizione: "Confermando si perderanno tutti i dati salvati." } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminazioneInCorso = true;
        this.libroUrlService.eliminaLibro(this.idLibro, this.libro.imagePath)
          .catch(error => {
            console.log(error);
            this.eliminazioneInCorso = false;
            this.router.navigate(["/account"], { queryParams: { "libroEliminato": 0 } });
          })
          .then(result => {
            if (result) {
              this.eliminazioneInCorso = false;
              this.router.navigate(["/account"], { queryParams: { "libroEliminato": 1 } });
            }
          })
      }
    })
  }

  aggiungiPreferiti() {
    this.preferiti.push(this.idLibro);
    this.database.collection("users").doc(this.userService.utente.uid).update({ "preferiti": this.preferiti })
      .catch(err => {
        console.log(err);
      })
      .then(result => {
        console.log("result", result);
      });
  }

  eliminaPreferiti() {
    console.log(this.preferiti);
    for (let i = 0; i < this.preferiti.length; i++) {
      if (this.preferiti[i] == this.idLibro) {          //per info vedi perferiti.component.ts in cercaLibro()
        if (this.preferiti[i] == this.preferiti[this.preferiti.length - 1]) {
          this.preferiti.pop();
        } else {
          this.preferiti[i] = this.preferiti[this.preferiti.length - 1];
          this.preferiti.pop();
        }
      }
    }
    this.database.collection("users").doc(this.userService.utente.uid).update({ "preferiti": this.preferiti })
      .catch(err => {
        console.log(err);
      })
      .then(result => {
        console.log("result", result);
      });
  }

  cercaPreferito() {
    if (this.userService.utente && this.userService.utente.uid) {
      this.database.collection("users").doc(this.userService.utente.uid).valueChanges().subscribe(val => {
        if (val) {
          this.preferiti = (<any>val).preferiti || [];
          let preferito = false;
          for (let i = 0; i < this.preferiti.length; i++) {
            console.log(this.preferiti[i])
            if (this.preferiti[i] == this.idLibro) {
              preferito = true;
            }
          }
          this.isPreferiti = preferito;
        }
        else {
          this.preferiti = [];
          this.isPreferiti = false;
        }

      })
    }
    else {
      this.preferiti = [];
      this.isPreferiti = false;
    }
  }

}
