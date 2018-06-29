import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';

@Component({
  selector: 'app-info-libro',
  templateUrl: './info-libro.component.html',
  styleUrls: ['./info-libro.component.css']
})
export class InfoLibroComponent implements OnInit {
  idLibro: String;
  libro: Libro = new Libro();
  constructor(private route: ActivatedRoute, private database: AngularFirestore) { }

  ngOnInit() {
    this.idLibro = this.route.snapshot.queryParams.id;//ottengo l'id del libro dai query params. Lo uso per ottenere info sul libro
    this.database.collection("books", (ref) =>  //query per ottenere tutti i libri con questo id
      ref.where('id', "==", this.idLibro)
    )
    .valueChanges().subscribe((val)=>{
      this.libro = (<Libro>val[0]);   //volo solo il prim libro (tanto id saranno diversi)
    })
  }

}
