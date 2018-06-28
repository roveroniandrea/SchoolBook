import { Component, ViewChild, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatButton } from '@angular/material';

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
/*
  @ViewChild("drawer") menuReference;
  @ViewChild("menuButton") menuButton: ElementRef;
  */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver) { }
/*
  chiudiMenu(){
    this.menuReference.toggle();
    console.log(this.menuButton);
    this.menuButton.nativeElement.;
  }
  */
}
