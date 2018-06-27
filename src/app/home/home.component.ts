import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  title = 'app';
  books : any[];

  constructor(db : AngularFirestore) {
    db.collection("books").valueChanges().subscribe(items => this.books = items);
  }

}
