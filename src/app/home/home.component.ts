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

  constructor(private database : AngularFirestore, 
    private libroUrlService : LibroUrlService, 
    private snackBar : MatSnackBar, 
    private route : ActivatedRoute) {
      
    this.database.collection("books",ref => ref.orderBy("prezzo").limit(8)).snapshotChanges().subscribe(items => {
      const nbooks = items.map(item => {
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        return this.libroUrlService.setLibroUrl(<Libro>{id,...doc});
      });
      this.booksPrice = nbooks;
      console.log(this.booksPrice)
    });

    this.database.collection("books",ref => ref.orderBy("data").limit(8)).snapshotChanges().subscribe(items => {
      const nbooks = items.map(item => {
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        return this.libroUrlService.setLibroUrl(<Libro>{id,...doc});
      });
      this.booksData = nbooks;
    });

    //controllo se ho il queryParam libroEliminato
    const libroEliminato = this.route.snapshot.queryParams.libroEliminato;
    if(libroEliminato == 0) {
      this.snackBar.open("Errore durante l'eliminazione del libro", "", {duration: 5000});
    }
    if(libroEliminato == 1) {
      this.snackBar.open("Libro eliminato correttamente", "", {duration: 5000});
    }

    //controllo se ho effettuato il logout nei queryParams
    const utenteLoggato = this.route.snapshot.queryParams.utenteLoggato;
    if(utenteLoggato == 0) {
      this.snackBar.open("Hai effettuato il logout", "", {duration: 5000});
    }
    if(utenteLoggato == 1) {
      this.snackBar.open("Hai effettuato il login", "", {duration: 5000});
    }
    if(utenteLoggato == 2) {
      this.snackBar.open("Email di recupero correttamente inviata", "", {duration:5000});
    }
  }
}
