import { Component, OnInit } from '@angular/core';
import { Autore } from '../classe-autore/classe-autore';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css']
})
export class ContattiComponent implements OnInit {
  utente: Autore = new Autore();
  libro: Libro = new Libro();
  // value = this.utente.mail; non ancora creata la mail quindi da errore
  // libro = this.libro.titolo; non ancora caricato la mail quindi da errore 
  constructor(private route: ActivatedRoute, private db: AngularFirestore) { }

  ngOnInit() {
    const id_utente = this.route.snapshot.queryParams.id_autore;
    const id_libro = this.route.snapshot.queryParams.id_libro;
    if(id_utente){
      this.utente.id = id_utente;
      this.cercaUtente();
    }
    if(id_libro){
      this.libro.id = id_libro;
      this.cercaLibro();
    }
  }

  cercaUtente(){
    this.db.collection("users").doc(this.utente.id).valueChanges().subscribe(val=>{
      let datiUtente = val;
      this.utente = <Autore>{id: this.utente.id, ...datiUtente};
      //console.log(this.utente);
    })
  }

  cercaLibro(){
    this.db.collection("books").doc(this.libro.id).valueChanges().subscribe(val=>{
      let datiLibro = val;
      this.libro = <Libro>{id: this.libro.id, ...datiLibro};
      //console.log(this.utente);
    })
  }

}
