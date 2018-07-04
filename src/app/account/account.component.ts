import { Component, OnInit } from '@angular/core';
import { UserService } from '../servizi/utente.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  mode = "see";
  accountForm : FormGroup;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.accountForm = new FormGroup({
      "nome": new FormControl(this.userService.utente.nome,Validators.required),
      "cognome": new FormControl(this.userService.utente.cognome),
      "mail": new FormControl(this.userService.utente.mail,[Validators.required,Validators.email]),
      "telefono": new FormControl(this.userService.utente.telefono),
      "scuola": new FormControl(this.userService.utente.scuola,Validators.required),
    })
  }

  submitAccount(){
    console.log("submitted",this.accountForm.value)
  }
}
