import { Component, OnInit } from '@angular/core';
import { UserService } from '../servizi/utente.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Autore } from '../classe-autore/classe-autore';
import { Libro } from '../classe-libro/classe-libro';
import { LibroUrlService } from '../servizi/libro-url.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  inserimentoLibro = null;
  mode = "see";
  accountForm: FormGroup;
  myBooks: Libro[];
  constructor(private route: ActivatedRoute, private userService: UserService, private db: AngularFirestore, private libroUrlService: LibroUrlService) { 
    this.inserimentoLibro = route.snapshot.queryParams.inserimentoLibro;
  }

  ngOnInit() {
    this.accountForm = new FormGroup({
      "nome": new FormControl(this.userService.utente.nome, Validators.required),
      "cognome": new FormControl(this.userService.utente.cognome),
      "mail": new FormControl(this.userService.utente.mail, [Validators.required, Validators.email]),
      "telefono": new FormControl(this.userService.utente.telefono),
      "scuola": new FormControl(this.userService.utente.scuola, Validators.required),
    })

    this.cercaMieiLibri();
  }

  submitAccount() {
    console.log("submitted", this.accountForm.value);
    this.mode = "see";
  }

  cercaMieiLibri() {
    this.db.collection("books", ref => ref.where("id_utente", "==", this.userService.utente.id)).snapshotChanges().subscribe(val => {
      this.myBooks = val.map(item => {
        const libro = <Libro>{id: item.payload.doc.id, ...item.payload.doc.data()}
        return this.libroUrlService.setLibroUrl(libro);
      });
    })
  }
}
