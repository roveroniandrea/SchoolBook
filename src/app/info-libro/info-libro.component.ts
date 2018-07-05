import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { Autore } from '../classe-autore/classe-autore';
import { LibroUrlService } from '../servizi/libro-url.service';

@Component({
  selector: 'app-info-libro',
  templateUrl: './info-libro.component.html',
  styleUrls: ['./info-libro.component.css']
})
export class InfoLibroComponent implements OnInit {
  idLibro: string;
  libro: Libro = new Libro();
  autore: Autore = new Autore();
  constructor(private route: ActivatedRoute, private database: AngularFirestore,private libroUrlService: LibroUrlService) { }
  //todo modificare subbmit
  ngOnInit() {
    this.idLibro = this.route.snapshot.queryParams.id;   //ottengo l'id del libro dai query params. Lo uso per ottenere info sul libro
    this.database.collection("books").doc(this.idLibro)  //cerco un libro con quell'id
      .valueChanges().subscribe(val => {
        this.libro = this.libroUrlService.setLibroUrl(<Libro>val);
        //console.log(this.libro.id_utente);
        this.cercaAutore();
      })
  }

  cercaAutore() {
    if (this.libro.id_utente) {
      this.database.collection("users").doc(this.libro.id_utente)
        .snapshotChanges().subscribe(val => {
          const id = val.payload.id;
          this.autore = <Autore>{ id, ...val.payload.data() };
          //console.log(this.autore);
        })
    }
  }
}
