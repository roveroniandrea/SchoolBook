import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { LibroUrlService } from '../servizi/libro-url.service';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  title = 'app';
  booksPrice : Libro[];
  booksData : Libro[];

  constructor(db : AngularFirestore, libroUrlService : LibroUrlService, private snackBar : MatSnackBar, private route : ActivatedRoute) {
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

    //controllo se ho il queryParam libroEliminato
    const libroEliminato = route.snapshot.queryParams.libroEliminato;
    if(libroEliminato == 0){
      snackBar.open("Libro non eliminato :(","",{duration: 2000});
    }
    if(libroEliminato == 1){
      snackBar.open("Libro eliminato correttamente!","",{duration: 2000});
    }

    //controllo se ho effettuato il logout nei queryParams
    const utenteLoggato = route.snapshot.queryParams.logout;
    if(utenteLoggato== 0){
      snackBar.open("Hai effettuato il logout","",{duration: 2000});
    }
    if(utenteLoggato== 1){
      snackBar.open("Hai effettuato il login","",{duration: 2000});
    }
  }
}
