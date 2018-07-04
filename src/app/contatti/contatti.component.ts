import { Component, OnInit } from '@angular/core';
import { Autore } from '../classe-autore/classe-autore';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css']
})
export class ContattiComponent implements OnInit {
  utente: Autore = new Autore();
  constructor(private route: ActivatedRoute, private db: AngularFirestore) { }

  ngOnInit() {
    this.utente = new Autore();
    const id_utente = this.route.snapshot.queryParams.id;
    if(id_utente){
      this.utente.id = id_utente;
      this.cercaUtente();
    }
  }

  cercaUtente(){
    this.db.collection("users").doc(this.utente.id).valueChanges().subscribe(val=>{
      let datiUtente = val;
      this.utente = <Autore>{id: this.utente.id, ...datiUtente};
      //console.log(this.utente);
    })
  }

}
