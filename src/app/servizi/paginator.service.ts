import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PaginatorService{
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );
  constructor(private breakpointObserver: BreakpointObserver) { }

  
  impostaPaginaCorrente(booksArray: any[], pagina, numRisultatiDaMostrare){
      let booksDisplay = [];
      for(let i=0;i<numRisultatiDaMostrare;i++){
        booksDisplay[i] = booksArray[i+(pagina-1)*numRisultatiDaMostrare];
      }
      //console.log("length array",booksDisplay.length);
      for(let i=0;i<booksDisplay.length;i++){
        if(!booksDisplay[i]){
          booksDisplay[i] = booksDisplay[booksDisplay.length-1];
          booksDisplay.pop();
          i--;
        }
      }
      return booksDisplay;
  }
}
