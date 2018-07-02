import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';

@Component({
  selector: 'app-catalogo-libri',
  templateUrl: './catalogo-libri.component.html',
  styleUrls: ['./catalogo-libri.component.css']
})
export class CatalogoLibriComponent implements OnInit {
  searchForm : FormGroup;
  db : AngularFirestore;
  allBooks: Libro[];
  constructor(db: AngularFirestore) {
    this.db = db;
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      'parametroRicerca': new FormControl(null,Validators.required)
    })
  }

  submitRicerca(){
    const parametroRicerca = this.searchForm.get("parametroRicerca").value;   //ottengo la query da cercare inserita nel form
    
    this.db.collection("books",ref=>ref.where("titolo","==",parametroRicerca)).snapshotChanges().subscribe(val=>{
      let nbooks: any[];   //nell'observable recupero tutti i libri corrispondenti alla stringa cercata
      nbooks = val.map(item=>{
        const id = item.payload.doc.id;
        const data = item.payload.doc.data();
        return {id, ...data}            //recupero il loro id e i dati
      });

      this.allBooks = <Libro[]>nbooks;
    })
    /*
    this.db.collection("books",ref=>ref.where("isbn","==",parametroRicerca)).snapshotChanges().subscribe(val=>{
      let nbooks: any[];   //nell'observable recupero tutti i libri corrispondenti alla stringa cercata
      nbooks = val.map(item=>{
        const id = item.payload.doc.id;
        const data = item.payload.doc.data();
        return {id, ...data}            //recupero il loro id e i dati
      });

      nbooks.forEach(item=>{
        this.allBooks.push(item);
      })
    })
    */
  }
}
