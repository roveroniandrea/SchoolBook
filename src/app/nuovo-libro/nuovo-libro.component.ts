import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-nuovo-libro',
  templateUrl: './nuovo-libro.component.html',
  styleUrls: ['./nuovo-libro.component.css']
})
export class NuovoLibroComponent implements OnInit {
  uploadForm : FormGroup;
  patternPrezzo = "^(?!0\.00)\d{1,3}(,\d{3})*(\.\d\d)?$";
  constructor() { }

  ngOnInit() {
    this.uploadForm = new FormGroup({
      "titolo" : new FormControl("",Validators.required),
      "isbn" : new FormControl(null,Validators.required),
      "prezzo" : new FormControl("00.00",Validators.required), //inserire pattern moneta
      "descrizione": new FormControl("",Validators.required)
    })
  }

  submitForm(){
    console.log(this.uploadForm.value)
  }

  annullaForm(){
    
  }
}
