import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as fromApp from '../store/app.reducer'
import { Store } from '@ngrx/store';

@Injectable({
    providedIn : "root"
})
export class AuthGuard implements CanActivate{
    constructor(private authService : AuthService, private router : Router,
        private store : Store<fromApp.AppState>){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | 
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.store.select('auth').pipe(take(1), 
            map(authUser => {
                return authUser.user;
            }),
            map(user => {
            const isAuth = !!user;
            if(isAuth){
                return isAuth;
            }else{
                return this.router.createUrlTree(['/auth']);
            }
        }));
    }
}