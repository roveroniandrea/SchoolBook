import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { StringService } from '../servizi/string.service';
import { LibroUrlService } from '../servizi/libro-url.service';
import { PaginatorService } from '../servizi/paginator.service';

@Component({
  selector: 'app-catalogo-libri',
  templateUrl: './catalogo-libri.component.html',
  styleUrls: ['./catalogo-libri.component.css']
})
export class CatalogoLibriComponent implements OnInit {
  searchForm: FormGroup;
  allBooks: Libro[] = [];
  allBooksDisplay : Libro[] = [];
  nessunLibroTrovato = false;
  ricercaInCorso = false;
  numRisultatiDaMostrare = 8;
  paginaCorrente = 1;
  nPages = [1, 2, 3, 4, 5];

  constructor(private database: AngularFirestore,
    private stringService: StringService,
    private libroUrlService: LibroUrlService,
    private paginatorService: PaginatorService) {
    paginatorService.isHandset$.subscribe(val => {
      if (val) {
        this.numRisultatiDaMostrare = 12;
      }
      else {
        this.numRisultatiDaMostrare = 16;
      }
      this.cambiaPagina(this.paginaCorrente);
    });
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      'parametroRicerca': new FormControl(null, Validators.required)
    });
  }

  submitRicerca() {
    this.nessunLibroTrovato = false;
    this.ricercaInCorso = true;
    const parametroRicerca = (<string>this.searchForm.get("parametroRicerca").value).toLowerCase();   //ottengo la query da cercare inserita nel form e la rendo lowercase
    let cercaTra = "titolo";
    if (this.stringService.hasOnlyNumber(parametroRicerca)) {
      cercaTra = "isbn";
    }
    console.log("cerco libro")
    this.database.collection("books", ref => ref.orderBy(cercaTra).startAt(parametroRicerca).endAt(parametroRicerca + "\uf8ff")).snapshotChanges().subscribe(val => {

      let nbooks: any[];   //nell'observable recupero tutti i libri corrispondenti alla stringa cercata
      nbooks = val.map(item => {
        const id = item.payload.doc.id;
        const data = item.payload.doc.data();
        return this.libroUrlService.setLibroUrl(<Libro>{ id, ...data })            //recupero il loro id e i dati
      });
      if (nbooks.length <= 0) {
        this.nessunLibroTrovato = true;
      }
      this.allBooks = <Libro[]>nbooks;
      this.cambiaPagina(this.paginaCorrente);
      this.ricercaInCorso = false;
      console.log("tutti i libri", this.allBooks);
    });
  }

  cambiaPagina(num) {
    //console.log("pagina");
    this.paginaCorrente = num;
    this.allBooksDisplay = this.paginatorService.impostaPaginaCorrente(<any[]>this.allBooks, this.paginaCorrente, this.numRisultatiDaMostrare);
    console.log("allBooksDisplay",this.allBooksDisplay)
  }
}
