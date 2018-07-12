import { Component, OnInit } from '@angular/core';
import { Libro } from '../classe-libro/classe-libro';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserService } from '../servizi/utente.service';

@Component({
  selector: 'app-preferiti',
  templateUrl: './preferiti.component.html',
  styleUrls: ['./preferiti.component.css']
})
export class PreferitiComponent implements OnInit {
  libro: Libro[] = [];
  preferiti: string[] = [];

  constructor(private database: AngularFirestore,
    private userService: UserService) {
    this.cercaPreferiti();
  }

  ngOnInit() {
  }

  cercaPreferiti() {
    this.database.collection("users").doc(this.userService.utente.uid).valueChanges().subscribe(val => {
      this.preferiti = (<any>val).preferiti;
      this.cercaLibro();
    })
  }

  cercaLibro() {
    for (let i = 0; i < this.preferiti.length; i++) {
      this.database.collection("books").doc(this.preferiti[i]).valueChanges().subscribe(val => {
        this.libro[i] = <Libro>val;
      })
    }
  }
}
