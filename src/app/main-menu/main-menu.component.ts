import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../servizi/utente.service';
import { PerditaModificheComponent } from '../perdita-modifiche/perdita-modifiche.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute, NavigationEnd } from '../../../node_modules/@angular/router';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {

  footerCompare = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private autenticazione: AngularFireAuth,
    public userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private matDialog: MatDialog,
    private router: Router,
    private snackBar : MatSnackBar) {
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd) { //se siamo in navigation end
        const url = val.urlAfterRedirects;
        if(url === "/"){
          this.footerCompare = true;
        }
        else{
          this.footerCompare = false;
        }
      }
    })
  }

  logout() {  //apre mat dialog per conferma
    const dialogRef = this.matDialog.open(PerditaModificheComponent, { data: { titolo: "Conferma Logout!", descrizione: "" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.autenticazione.auth.signOut()
          .catch(error => {
          })
          .then(result => {
            this.snackBar.open("Logout effettuato con successo","",{duration: 5000});
            this.router.navigateByUrl("/", { queryParams: { "utenteLoggato": 0 } })
          })
      }
    })
  }

}
