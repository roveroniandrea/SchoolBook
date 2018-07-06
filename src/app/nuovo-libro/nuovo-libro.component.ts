import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PerditaModificheComponent } from '../perdita-modifiche/perdita-modifiche.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuovo-libro',
  templateUrl: './nuovo-libro.component.html',
  styleUrls: ['./nuovo-libro.component.css']
})
export class NuovoLibroComponent implements OnInit {
  uploadForm : FormGroup;
  patternPrezzo = "^(?!0\.00)\d{1,3}(,\d{3})*(\.\d\d)?$";
  constructor(private confermaUscita: MatDialog, private router: Router) { }

  ngOnInit() {
    this.uploadForm = new FormGroup({
      "titolo" : new FormControl("",Validators.required),
      "isbn" : new FormControl(null,Validators.required),
      "prezzo" : new FormControl("",Validators.required), //inserire pattern moneta
      "descrizione": new FormControl("",Validators.required)
    })
  }

  submitForm(){
    console.log(this.uploadForm.value);
    // manca il caricamento su firebase
    this.router.navigate(["/account"], { queryParams: { inserimentoLibro : 2 }});
  }

  annullaForm(){
    const dialogRef = this.confermaUscita.open(PerditaModificheComponent);
    dialogRef.afterClosed().subscribe(result=>{
      if(result) {
        this.router.navigate(["/account"], { queryParams: { inserimentoLibro : 1 }});
      }
    })
  }
}
