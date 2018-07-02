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
  idLibro: string;
  libro: Libro = new Libro();
  constructor(private route: ActivatedRoute, private database: AngularFirestore) { }
//todo modificare subbmit
  ngOnInit() {
    this.idLibro = this.route.snapshot.queryParams.id;   //ottengo l'id del libro dai query params. Lo uso per ottenere info sul libro
    
    this.database.collection("books").doc(this.idLibro)
    .valueChanges().subscribe(val=>{
      this.libro = (<Libro>val);
    })
  }

}
