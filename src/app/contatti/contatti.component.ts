import { Component, OnInit } from '@angular/core';
import { Autore } from '../classe-autore/classe-autore';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { LibroUrlService } from '../servizi/libro-url.service';
import { UserService } from '../servizi/utente.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css']
})
export class ContattiComponent implements OnInit {
  infoMail = {
    nomeDestinatario : null,
    mailDestinatario : null,
    nomeMittente : null,
    mailMittente : null,
    //testo = 
    titoloLibro : null
    
  }
  panelOpenState = false;
  utente: Autore = new Autore();
  libro: Libro = new Libro();
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //'Access-Control-Allow-Origin' : "*"
      //'Access-Control-Allow-Headers' : "Content-Type"
    })
  }

  constructor(private route: ActivatedRoute, 
    private userService: UserService, 
    private db: AngularFirestore, 
    private libroUrlService:LibroUrlService,
    private httpClient : HttpClient) { }

  ngOnInit() {
    const id_libro = this.route.snapshot.params["id_libro"];
      this.libro.id = id_libro;
      this.cercaLibro();
  }

  cercaUtente(id_utente){
    this.db.collection("users").doc(id_utente).valueChanges().subscribe(val=>{
      let datiUtente = val;
      this.utente = <Autore>{uid: id_utente, ...datiUtente};
    })
  }

  cercaLibro(){
    this.db.collection("books").doc(this.libro.id).valueChanges().subscribe(val=>{
      const myLibro = <Libro>{id: this.libro.id, ...val}
      this.libro = this.libroUrlService.setLibroUrl(myLibro);
      this.cercaUtente(this.libro.id_utente);
    })
  }

  invioMail() {
    this.infoMail.nomeDestinatario = this.utente.nome;
    this.infoMail.mailDestinatario = this.utente.mail;
    this.infoMail.nomeMittente = this.userService.utente.nome;
    this.infoMail.mailMittente = this.userService.utente.mail;
    //testo = 
    this.infoMail.titoloLibro = this.libro.titolo; 
    console.log("nomeDestinatario",this.infoMail.nomeDestinatario,
      "mailDestinatario", this.infoMail.mailDestinatario,
      "nomeMittente", this.infoMail.nomeMittente,
      "mailMittente", this.infoMail.mailMittente,
      "titoloLibro", this.infoMail.titoloLibro);
    this.httpClient.post("//us-central1-school-book-an.cloudfunctions.net/contattaUtente", this.infoMail, this.httpOptions).subscribe(
      result => {
        console.log("invio mail: ",result);
      })
      console.log("richiesta inviata.");
  }
}