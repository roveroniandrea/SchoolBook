import { Component, OnInit } from '@angular/core';
import { Autore } from '../classe-autore/classe-autore';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css']
})
export class ContattiComponent implements OnInit {
  utente: Autore;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.utente = new Autore();
    const id_utente = this.route.snapshot.queryParams.id_utente;
    if(id_utente){
      this.utente.id = id_utente;
    }
    console.log(this.utente);
  }

}
