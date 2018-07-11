import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../servizi/utente.service';
import { PerditaModificheComponent } from '../perdita-modifiche/perdita-modifiche.component';
import { MatDialog } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {
  link = [
    "Home",
    "Catalogo libri",
    "Contatti",
    "Preferiti",
    "Login",
    "Registrati",
    "Logout"
  ]

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private autenticazione: AngularFireAuth, private userService: UserService, private breakpointObserver: BreakpointObserver, private matDialog: MatDialog, private router: Router) { }

  logout() {  //apre mat dialog per conferma
    const dialogRef = this.matDialog.open(PerditaModificheComponent, { data: { titolo: "Conferma Logout!", descrizione: "" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.autenticazione.auth.signOut()
          .catch(err => {
            console.log("Logout non effettuato.");
          })
          .then(res => {
            console.log("Logout effettuato.");
            this.router.navigateByUrl("/", { queryParams: { "logout": 1 } })
          })
      }
    })
  }

}
