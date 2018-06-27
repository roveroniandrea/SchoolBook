import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  books : any[];

  constructor(db : AngularFirestore) {
    db.collection("books").valueChanges().subscribe(items => this.books = items);
  }
}
