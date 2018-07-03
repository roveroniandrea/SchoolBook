import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { StringService } from '../servizi/string.service';

@Component({
  selector: 'app-catalogo-libri',
  templateUrl: './catalogo-libri.component.html',
  styleUrls: ['./catalogo-libri.component.css']
})
export class CatalogoLibriComponent implements OnInit {
  searchForm: FormGroup;
  allBooks: Libro[];
  nessunLibroTrovato = false;
  constructor(private db: AngularFirestore, private stringService: StringService) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      'parametroRicerca': new FormControl(null, Validators.required)
    });
  }

  submitRicerca() {
    this.nessunLibroTrovato = false;
    const parametroRicerca = (<string>this.searchForm.get("parametroRicerca").value).toLowerCase();   //ottengo la query da cercare inserita nel form e la rendo lowercase
    let cercaTra = "titolo";
    if (this.stringService.hasOnlyNumber(parametroRicerca)) {
      cercaTra = "isbn";
    }

    this.db.collection("books", ref => ref.orderBy(cercaTra).startAt(parametroRicerca).endAt(parametroRicerca + "\uf8ff")).snapshotChanges().subscribe(val => {
      let nbooks: any[];   //nell'observable recupero tutti i libri corrispondenti alla stringa cercata
      nbooks = val.map(item => {
        const id = item.payload.doc.id;
        const data = item.payload.doc.data();
        return { id, ...data }            //recupero il loro id e i dati
      });
      if(nbooks.length<=0){
        this.nessunLibroTrovato= true;
      }
      this.allBooks = <Libro[]>nbooks;
    });
  }
}
