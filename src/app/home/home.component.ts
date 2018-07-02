import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  title = 'app';
  books : any[];   //non riesco ad utilizzare la classse Libro
  constructor(db : AngularFirestore) {
    /*
    db.collection("books").valueChanges().subscribe(
      (items)=>{
        this.books = items;
        console.log(this.books);
      }
    );
    */
    db.collection("books").snapshotChanges().subscribe(items=>{
      const nbooks = items.map(item=>{
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        return {id,...doc};
      });
      this.books = nbooks;
    });
  }

}
