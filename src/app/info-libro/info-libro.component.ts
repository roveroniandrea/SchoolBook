import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { Autore } from '../classe-autore/classe-autore';

@Component({
  selector: 'app-info-libro',
  templateUrl: './info-libro.component.html',
  styleUrls: ['./info-libro.component.css']
})
export class InfoLibroComponent implements OnInit {
  idLibro: string;
  libro: Libro = new Libro();
  autore: Autore;
  constructor(private route: ActivatedRoute, private database: AngularFirestore) { }
//todo modificare subbmit
  ngOnInit() {
    this.idLibro = this.route.snapshot.queryParams.id;   //ottengo l'id del libro dai query params. Lo uso per ottenere info sul libro
    
    this.database.collection("books").doc(this.idLibro)  //cerco un libro con quell'id
    .valueChanges().subscribe(val=>{
      this.libro = (<Libro>val);
      this.cercaAutore();
    })
  }

    cercaAutore(){
      this.database.collection("users").doc(this.libro.id_utente)
      .valueChanges().subscribe(val=>{
        this.autore = <Autore>val;
      })
    }
}
