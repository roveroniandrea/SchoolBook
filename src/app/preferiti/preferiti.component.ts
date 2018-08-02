import { Component, OnInit } from '@angular/core';
import { Libro } from '../classe-libro/classe-libro';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserService } from '../servizi/utente.service';
import { LibroUrlService } from '../servizi/libro-url.service';
import { PaginatorService } from '../servizi/paginator.service';

@Component({
  selector: 'app-preferiti',
  templateUrl: './preferiti.component.html',
  styleUrls: ['./preferiti.component.css']
})

export class PreferitiComponent implements OnInit {
  /* Variabili */
  libro: Libro[] = [];
  libroDisplay : Libro[] = [];
  preferiti: string[] = [];
  stoCercandoLibri = false;
  numRisultatiDaMostrare = 16;
  paginaCorrente = 1;
  nPages = [1, 2, 3, 4, 5];
  constructor(private database: AngularFirestore,
    private userService: UserService,
    private libroUrlService: LibroUrlService,
    private paginatorService: PaginatorService) {
    paginatorService.isHandset$.subscribe(val => {
      if (val) {
        this.numRisultatiDaMostrare = 12;
      }
      else {
        this.numRisultatiDaMostrare = 16;
      }
      this.cambiaPagina(this.paginaCorrente);
    });
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
        if (val.payload.exists) { //controllo se il libro esiste
          this.libro[i] = <Libro>val.payload.data();
          this.libro[i].id = val.payload.id;
          this.libro[i] = this.libroUrlService.setLibroUrl(this.libro[i]);
        }
        else {
          this.libro[i] = new Libro(); //imposto a null l'elemento. La card comparirà solo se libro != null
        }
        if (this.libro.length == this.preferiti.length) {
          this.controllaPreferiti(); //solo quando il for ha finito controllo i libri nulli
        }
      })
    }
    this.stoCercandoLibri = false;
  }

  controllaPreferiti() { //elimina i libri nulli
    if (this.libro) {
      for (let i = 0; i < this.libro.length; i++) {
        if (this.libro[i] && this.libro[i].id == "") {
          this.libro[i] = this.libro[this.libro.length - 1];
          this.libro.pop();
        }
      }
    }
    else {
      this.libro = [];
    }
    this.cambiaPagina(this.paginaCorrente);
  }

  cambiaPagina(num) {
    this.paginaCorrente = num;
    this.libroDisplay = this.paginatorService.impostaPaginaCorrente(<any[]>this.libro, this.paginaCorrente, this.numRisultatiDaMostrare);
  }
}
