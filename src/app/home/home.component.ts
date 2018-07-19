import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { LibroUrlService } from '../servizi/libro-url.service';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'app';
  booksPrice: Libro[];
  booksData: Libro[];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(db: AngularFirestore, 
    libroUrlService: LibroUrlService, 
    private snackBar: MatSnackBar, 
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver) {

    this.isHandset$.subscribe(val => {
      if (val) {
        this.numRisultatiDaMostrare = 6;
      }
      else{
        this.numRisultatiDaMostrare = 8;
      }
    })
    
      
    db.collection("books", ref => ref.orderBy("prezzo").limit(6)).snapshotChanges().subscribe(items => {
      const nbooks = items.map(item => {
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        //console.log((<Libro>{id,...doc}).data)
        //console.log(datePipe.transform((<Libro>doc).data,"full","+0130"));
        //console.log(new Date((<Libro>doc).data))
        return libroUrlService.setLibroUrl(<Libro>{ id, ...doc });
      });
      this.booksPrice = nbooks;
      /*
      console.log(this.booksPrice[4].data.seconds);
      let datePipe = new DatePipe("en-EN");
      console.log(datePipe.transform(this.booksPrice[4].data.nanoseconds,"full","+0130"))
      */
    });

    db.collection("books", ref => ref.orderBy("data", "desc").limit(6)).snapshotChanges().subscribe(items => {
      const nbooks = items.map(item => {
        const id = item.payload.doc.id;
        const doc = item.payload.doc.data();
        return libroUrlService.setLibroUrl(<Libro>{ id, ...doc });
      });
      this.booksData = nbooks;
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
}
