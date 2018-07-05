import { Component, OnInit } from '@angular/core';
import { Autore } from '../classe-autore/classe-autore';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { LibroUrlService } from '../servizi/libro-url.service';
@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css']
})
export class ContattiComponent implements OnInit {
  panelOpenState = false;
  utente: Autore = new Autore();
  libro: Libro = new Libro();
  // value = this.utente.mail; non ancora creata la mail quindi da errore
  // libro = this.libro.titolo; non ancora caricato la mail quindi da errore 
  constructor(private route: ActivatedRoute, private db: AngularFirestore, private libroUrlService:LibroUrlService) { }

  ngOnInit() {
    const id_libro = this.route.snapshot.params["id_libro"];
      this.libro.id = id_libro;
      this.cercaLibro();
  }

  cercaUtente(id_utente){
    this.db.collection("users").doc(id_utente).valueChanges().subscribe(val=>{
      let datiUtente = val;
      this.utente = <Autore>{id: id_utente, ...datiUtente};
    })
  }

  cercaLibro(){
    this.db.collection("books").doc(this.libro.id).valueChanges().subscribe(val=>{
      const myLibro = <Libro>{id: this.libro.id, ...val}
      this.libro = this.libroUrlService.setLibroUrl(myLibro);
      this.cercaUtente(this.libro.id_utente);
    })
  }

}
