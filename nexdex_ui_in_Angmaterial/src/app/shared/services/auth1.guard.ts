
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class Auth1Guard implements CanActivate {
  constructor(private routes : Router,private api: ApiService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
   this.api.getRouterurl();
      if(this.api.isLoggedOut()){
        return true;
      }
      else
      {
        this.routes.navigateByUrl('/dashboard')
        return false;
      }
  }

}
