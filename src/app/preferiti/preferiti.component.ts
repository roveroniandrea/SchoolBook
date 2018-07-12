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
  libro: Libro[] = [];
  preferiti: string[] = [];

  constructor(private database: AngularFirestore,
    private userService: UserService,
    private libroUrlService: LibroUrlService) {
    this.cercaPreferiti();
  }

  ngOnInit() {
  }

  cercaPreferiti() {
    this.database.collection("users").doc(this.userService.utente.uid).snapshotChanges().subscribe(val => {
      this.preferiti = (<any>val).payload.data().preferiti;
      this.cercaLibro();
    })
  }

  cercaLibro() {
    for (let i = 0; i < this.preferiti.length; i++) {
      this.database.collection("books").doc(this.preferiti[i]).snapshotChanges().subscribe(val => {
        this.libro[i] = <Libro>val.payload.data();
        this.libro[i].id = val.payload.id;
        this.libro[i] = this.libroUrlService.setLibroUrl(this.libro[i]);
      })
    }
  }
}
