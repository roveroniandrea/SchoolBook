import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  libri = [
    "1",
    "2",
    "3",
    "4",
    "5"
  ]
  title = 'app';
  books : any[];

  constructor(db : AngularFirestore) {
    db.collection("books").valueChanges().subscribe(items => this.books = items);
  }

}
