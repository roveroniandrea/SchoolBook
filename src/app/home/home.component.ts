import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { LibroUrlService } from '../servizi/libro-url.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  title = 'app';
  booksPrice : Libro[];
  booksData : Libro[];

  constructor(db : AngularFirestore, libroUrlService : LibroUrlService) {
    db.collection("books",ref=>ref.orderBy("prezzo").limit(6)).snapshotChanges().subscribe(items=>{
      const nbooks = items.map(item=>{
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        return libroUrlService.setLibroUrl(<Libro>{id,...doc});
      });
      this.booksPrice = nbooks;
      console.log(this.booksPrice)
    });

    db.collection("books",ref=>ref.orderBy("data").limit(6)).snapshotChanges().subscribe(items=>{
      const nbooks = items.map(item=>{
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        return libroUrlService.setLibroUrl(<Libro>{id,...doc});
      });
      this.booksData = nbooks;
    });
  }

}
