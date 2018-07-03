import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  title = 'app';
  booksPrice : any[];   //non riesco ad utilizzare la classse Libro
  booksData : any[];

  constructor(db : AngularFirestore) {
    db.collection("books",ref=>ref.orderBy("prezzo").limit(6)).snapshotChanges().subscribe(items=>{
      const nbooks = items.map(item=>{
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        return {id,...doc};
      });
      this.booksPrice = nbooks;
    });

    db.collection("books",ref=>ref.orderBy("data").limit(6)).snapshotChanges().subscribe(items=>{
      const nbooks = items.map(item=>{
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        return {id,...doc};
      });
      this.booksData = nbooks;
    });
  }

}
