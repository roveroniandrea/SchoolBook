import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from "../../../node_modules/@angular/router";
import { Observable } from "../../../node_modules/rxjs";
import { Injectable } from "../../../node_modules/@angular/core";
import { UserService } from "./utente.service";


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private userService : UserService, private router : Router){}
    canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean{
      return this.userService.verificaStatoUtente()   //il servizio ritorna l'utente con credenziali (no proprietà di firebase)
      .then(user=>{
          if(user){
              return true;
          }
          else{
              this.router.navigateByUrl("/login");
              return false;
          }
      })
    }
}

@Injectable()
export class AuthGuardLoginRegister implements CanActivate{ //GUARDIA PER LOGIN/REGISTER DOVE L'UTENTE NON DEVE ESSERE LOGGATO
    constructor(private userService : UserService, private router : Router){}
    canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean{
      return this.userService.verificaStatoUtente()   //il servizio ritorna l'utente con credenziali (no proprietà di firebase)
      .then(user=>{
          if(!user){
              return true;
          }
          else{
              this.router.navigateByUrl("/");
              return false;
          }
      })
    }
}