import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from "../../../node_modules/@angular/router";
import { Observable } from "../../../node_modules/rxjs";
import { Injectable } from "../../../node_modules/@angular/core";
import { UserService } from "./utente.service";


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private userService : UserService, private router : Router){}
    canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean{
      return this.userService.verificaStatoUtente()
      .then(user=>{
          //console.log("utente",user);
          if(user){
              return true;
          }
          else{
              this.router.navigateByUrl("/not-found");
              return false;
          }
      })
    }
}