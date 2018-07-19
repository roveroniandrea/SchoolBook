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
export class HomeComponent {
  title = 'app';
  booksPrice: Libro[];
  booksPriceDisplay: Libro[];
  booksData: Libro[];
  booksDataDisplay: Libro[];
  nPages = [1, 2, 3, 4, 5];

  constructor(private database: AngularFirestore,
    private libroUrlService: LibroUrlService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) {

    this.database.collection("books", ref => ref.orderBy("prezzo")).snapshotChanges().subscribe(items => {
      const nbooks = items.map(item => {
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        return this.libroUrlService.setLibroUrl(<Libro>{ id, ...doc });
      });
      this.booksPrice = nbooks;
      this.clickButton(1, 1);
      console.log(this.booksPrice)
    });

    this.database.collection("books", ref => ref.orderBy("data").limit(10)).snapshotChanges().subscribe(items => {
      const nbooks = items.map(item => {
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        return this.libroUrlService.setLibroUrl(<Libro>{ id, ...doc });
      });
      this.booksData = nbooks;
      this.clickButton(2, 1);
    });

    //controllo se ho effettuato il logout nei queryParams
    const utenteLoggato = this.route.snapshot.queryParams.utenteLoggato;
    if (utenteLoggato == 0) {
      this.snackBar.open("Hai effettuato il logout", "", { duration: 5000 });
    }
    if (utenteLoggato == 1) {
      this.snackBar.open("Hai effettuato il login", "", { duration: 5000 });
    }
    if (utenteLoggato == 2) {
      this.snackBar.open("Email di recupero correttamente inviata", "", { duration: 5000 });
    }
  }

  clickButton(array, index) {
    console.log("array", array);
    console.log("index", index);
    var temp = 0;
    if (array == 1) {
      this.booksPriceDisplay = [];
      for (let i = 3; i < 11; i++) {
      //for (let i = 8 * (index - 1); i < 8 * (index - 1) + 8; i++) {

        console.log("entra");
        this.booksPriceDisplay[temp] = this.booksPrice[i];
        console.log("temp", temp);
        console.log("this.booksPriceDisplay", this.booksPriceDisplay[i]);
        temp++;
      }
      console.log("va il primo");
    }
    if (array == 2) {
      this.booksDataDisplay = [];
      for (let i = 8 * (index - 1); i < 8 * (index - 1) + 8; i++) {
        this.booksDataDisplay[temp] = this.booksData[i];
        temp++;
      }
      console.log("va il secondo");
    }
  }
}
