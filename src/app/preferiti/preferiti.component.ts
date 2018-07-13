import { Component, OnInit } from '@angular/core';
import { Libro } from '../classe-libro/classe-libro';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserService } from '../servizi/utente.service';
import { LibroUrlService } from '../servizi/libro-url.service';

@Component({
  selector: 'app-preferiti',
  templateUrl: './preferiti.component.html',
  styleUrls: ['./preferiti.component.css']
})

export class PreferitiComponent implements OnInit {
  /* Variabili */
  libro: Libro[] = [];
  preferiti: string[] = [];
  stoCercandoLibri = false;

  constructor(private database: AngularFirestore,
    private userService: UserService,
    private libroUrlService: LibroUrlService) {
    this.cercaPreferiti();
  }

  ngOnInit() {
  }

  /* Cerco se ci sono dei preferiti in user */
  cercaPreferiti() {
    this.stoCercandoLibri = true;
    this.database.collection("users").doc(this.userService.utente.uid).snapshotChanges().subscribe(val => {
      this.preferiti = (<any>val).payload.data().preferiti;
      if (!this.preferiti) {
        this.preferiti = [];
      }
      this.cercaLibro();
    })
  }

  /* Cerco il libro corrispondente all'uid trovato nello user */
  cercaLibro() {
    this.libro = [];
    for (let i = 0; i < this.preferiti.length; i++) {
      this.database.collection("books").doc(this.preferiti[i]).snapshotChanges().subscribe(val => {
        this.libro[i] = <Libro>val.payload.data();
        this.libro[i].id = val.payload.id;
        this.libro[i] = this.libroUrlService.setLibroUrl(this.libro[i]);
      })
    }
    this.stoCercandoLibri = false;
  }
}
