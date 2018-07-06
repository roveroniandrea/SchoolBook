import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PerditaModificheComponent } from '../perdita-modifiche/perdita-modifiche.component';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Libro } from '../classe-libro/classe-libro';
import { UserService } from '../servizi/utente.service';

@Component({
  selector: 'app-nuovo-libro',
  templateUrl: './nuovo-libro.component.html',
  styleUrls: ['./nuovo-libro.component.css']
})
export class NuovoLibroComponent implements OnInit {
  uploadForm: FormGroup;
  patternPrezzo = "^(?!0\.00)\d{1,3}(,\d{3})*(\.\d\d)?$";
  afuConfig = {
    uploadAPI: {
      url: "/uploadImage"
    },
    formatsAllowed: ".jpg,.png,.jpeg",
  };

  constructor(private confermaUscita: MatDialog, private router: Router, private db : AngularFirestore,private userService: UserService) { }

  ngOnInit() {
    this.uploadForm = new FormGroup({
      "titolo": new FormControl("", Validators.required),
      "isbn": new FormControl(null, Validators.required),
      "prezzo": new FormControl("00.00", Validators.required), //inserire pattern moneta
      "descrizione": new FormControl("", Validators.required)
    })
  }

  submitForm() {
    //console.log(this.uploadForm.value);
    let newLibro = <Libro>this.uploadForm.value;
    newLibro.id_utente = this.userService.utente.id;
    //console.log(newLibro)
    this.db.collection("books").add(newLibro)
    .then(val=>console.log(val),err=>console.log(err))
    this.router.navigate(["/account"], { queryParams: { inserimentoLibro : 2 }});
  }

  annullaForm() {
    const dialogRef = this.confermaUscita.open(PerditaModificheComponent);
    dialogRef.afterClosed().subscribe(result=>{
      if(result) {
        this.router.navigate(["/account"], { queryParams: { inserimentoLibro : 1 }});
      }
    })
  }
}
