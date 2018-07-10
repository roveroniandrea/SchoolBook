import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})
export class RegistrazioneComponent implements OnInit {
  accountForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.accountForm = new FormGroup({
      "nome": new FormControl("", Validators.required),
      "cognome": new FormControl(""),
      "mail": new FormControl("", [Validators.required, Validators.email]),
      "telefono": new FormControl(""),
      "scuola": new FormControl("", Validators.required),
      "password": new FormControl("", Validators.required),
    })
  }

}
