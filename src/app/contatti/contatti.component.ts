import { Component, OnInit } from '@angular/core';
import { Autore } from '../classe-autore/classe-autore';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { LibroUrlService } from '../servizi/libro-url.service';
import { UserService } from '../servizi/utente.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { MatSnackBar } from '../../../node_modules/@angular/material';

@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css']
})
export class ContattiComponent implements OnInit {
  infoMail = {
    nomeDestinatario: null,
    mailDestinatario: null,
    nomeMittente: null,
    mailMittente: null,
    testo: null,
    titoloLibro: null
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
  };
  testoForm: FormGroup;
  stoInviandoRichiesta = false;
  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private database: AngularFirestore,
    private libroUrlService: LibroUrlService,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router) {
    //imposto il form
    this.testoForm = new FormGroup({
      "testo": new FormControl("", Validators.required),
    })
  }

  ngOnInit() {
    const id_libro = this.route.snapshot.params["id_libro"];
    this.libro.id = id_libro;
    this.cercaLibro();
  }

  cercaUtente(id_utente) {
    this.database.collection("users").doc(id_utente).valueChanges().subscribe(val => {
      let datiUtente = val;
      this.utente = <Autore>{ uid: id_utente, ...datiUtente };
    })
  }

  cercaLibro() {
    this.database.collection("books").doc(this.libro.id).valueChanges().subscribe(val => {
      const myLibro = <Libro>{ id: this.libro.id, ...val }
      this.libro = this.libroUrlService.setLibroUrl(myLibro);
      this.cercaUtente(this.libro.id_utente);
    })
  }

  invioMail() {
    this.infoMail.nomeDestinatario = this.utente.nome;
    this.infoMail.mailDestinatario = this.utente.mail;
    this.infoMail.nomeMittente = this.userService.utente.nome;
    this.infoMail.mailMittente = this.userService.utente.mail;
    this.infoMail.testo = this.testoForm.value.testo;
    this.infoMail.titoloLibro = this.libro.titolo;

    this.stoInviandoRichiesta = true;
    this.httpClient.post("//us-central1-school-book-an.cloudfunctions.net/contattaUtente", this.infoMail, this.httpOptions).subscribe(result => {
      let response = <any>result;
      if (response.error) {
        if (response.error != "OPTIONS") {
          console.log("Mail non inviata errore: ", response.error);
          this.snackBar.open("Errore durante l'invio della mail", "", { duration: 5000 })
          .afterDismissed().subscribe(dismiss=>{
            this.stoInviandoRichiesta = false;
          });
        }
      }
      else {
        //LASCIARE 2 SECONDI, ALTRIMENTI CI METT TROPPO TEMPO A REINDIRIZZARE ED E' BRUTTO
        this.snackBar.open("Richiesta inviata correttamente", "", { duration: 2000 }).afterDismissed().subscribe(dismiss => {
          this.stoInviandoRichiesta = false;
          this.router.navigate(["/infoLibro", this.libro.id]);
        })
      }
    })
  }
}