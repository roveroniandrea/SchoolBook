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
  constructor(private route: ActivatedRoute, private database: AngularFirestore, private libroUrlService: LibroUrlService, private userService: UserService, private matDialog: MatDialog, private router: Router, private storage : AngularFireStorage) { }
  //todo modificare subbmit
  
  ngOnInit() {
    this.idLibro = this.route.snapshot.queryParams.id;   //ottengo l'id del libro dai query params. Lo uso per ottenere info sul libro
    this.database.collection("books").doc(this.idLibro)  //cerco un libro con quell'id
      .valueChanges().subscribe(val => {
        if (val) { //uso un controllo per verificare se il libro esiste ancora e non è stato eliminato
          this.libro = this.libroUrlService.setLibroUrl(<Libro>val);
          //console.log(this.libro.id_utente);
          this.cercaAutore();
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
    const dialogRef = this.matDialog.open(PerditaModificheComponent, { data: { titolo: "Vuoi eliminare questo libro?", descrizione: "Non sarà più disponibile!" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminazioneLibroConfermata()
      }
    })
  }

  eliminazioneLibroConfermata() {//elimina definitivamente il libro e l'eventuale foto
  if(this.libro.imageUrl){
    //todo non cancella immagini (serve path ma abbiamo imageUrl)
  }
    this.database.collection("books").doc(this.idLibro).delete().then(result => {
      this.router.navigate(["/"]);
    })
  }
}
