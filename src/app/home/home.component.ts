import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { LibroUrlService } from '../servizi/libro-url.service';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { PaginatorService } from '../servizi/paginator.service';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'app';
  booksPrice: Libro[] = [];
  booksPriceDisplay: Libro[] = [];
  booksData: Libro[] = [];
  booksDataDisplay: Libro[] = [];
  paginaCorrentePrezzo = 1; //La pagina corrente del prezzo
  paginaCorrenteData = 1;
  numRisultatiDaMostrare = 8;
  nPages = [1, 2, 3, 4, 5];
  paginatorSubscription = Subscription;


  constructor(private database: AngularFirestore,
    private libroUrlService: LibroUrlService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public paginatorService: PaginatorService) {

    paginatorService.isHandset$.subscribe(val => {
      if (val) {
        this.numRisultatiDaMostrare = 6;
      }
      else {
        this.numRisultatiDaMostrare = 8;
      }

      if (this.booksPrice && this.booksPrice.length) {
        this.cambiaPaginaPrezzo(this.paginaCorrentePrezzo);
      }
      if (this.booksData && this.booksData.length) {
        this.cambiaPaginaData(this.paginaCorrenteData);
      }

      //console.log(this.numRisultatiDaMostrare);
    })

    database.collection("books", ref => ref.orderBy("prezzo")).snapshotChanges().subscribe(items => {
      const nbooks = items.map(item => {
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        return libroUrlService.setLibroUrl(<Libro>{ id, ...doc });
      });
      this.booksPrice = nbooks;
      this.cambiaPaginaPrezzo(this.paginaCorrentePrezzo);
    });

    database.collection("books", ref => ref.orderBy("data", "desc")).snapshotChanges().subscribe(items => {
      const nbooks = items.map(item => {
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        return libroUrlService.setLibroUrl(<Libro>{ id, ...doc });
      });
      this.booksData = nbooks;
      this.cambiaPaginaData(this.paginaCorrenteData);
    });

    //controllo se ho effettuato il logout nei queryParams
    const utenteLoggato = route.snapshot.queryParams.utenteLoggato;
    if (utenteLoggato == 0) {
      snackBar.open("Hai effettuato il logout", "", { duration: 5000 });
    }
    if (utenteLoggato == 1) {
      snackBar.open("Hai effettuato il login", "", { duration: 5000 });
    }
    if (utenteLoggato == 2) {
      snackBar.open("Email di recupero correttamente inviata", "", { duration: 5000 });
    }
  }

  cambiaPaginaPrezzo(num) {
    this.paginaCorrentePrezzo = num;
    this.booksPriceDisplay = this.paginatorService.impostaPaginaCorrente(this.booksPrice, this.paginaCorrentePrezzo, this.numRisultatiDaMostrare);
    //console.log(this.booksPriceDisplay);
  }

  cambiaPaginaData(num) {
    this.paginaCorrenteData = num;
    this.booksDataDisplay = this.paginatorService.impostaPaginaCorrente(this.booksData, this.paginaCorrenteData, this.numRisultatiDaMostrare);
    console.log(this.booksDataDisplay);
  }
}
