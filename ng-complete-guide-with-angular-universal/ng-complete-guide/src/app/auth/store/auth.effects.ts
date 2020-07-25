import { Actions, ofType, Effect } from '@ngrx/effects'
import * as AuthActions from './auth.actions'
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment'
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData{
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered? : boolean 
  }

const handleAuthentication = (respData : AuthResponseData) => {
    const expirationDate = new Date(new Date().getTime() + +respData.expiresIn * 1000);
    const user = new User(respData.email, respData.localId, respData.idToken, expirationDate);
    localStorage.setItem('userData',JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({email: respData.email, userId: respData.localId,
        token : respData.idToken, expirationDate: expirationDate, redirect : true}); 
};

const handleError = (errorResponse) => {
    let errorMessage = "Unknown error occured!";
    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new AuthActions.AuthenticateFailed(errorMessage));
    }
    switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = "This email Id is already exist";
             break;
        case 'INVALID_PASSWORD': 
            errorMessage = "Entered password is wrong!";
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = "Entered email does not exist!";
            break;
    }
    return of(new AuthActions.AuthenticateFailed(errorMessage));
};

@Injectable()
export class AuthEffects{

    signUpEndPoint:string = 
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="+environment.firebaseAPIKey;

    signInEndPoint:string = 
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+environment.firebaseAPIKey;

    constructor(private actions$ : Actions, private httpClient : HttpClient,
        private router : Router, private authService : AuthService){}

    @Effect()
    signupStart = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupData : AuthActions.SignupStart) => {
            return this.httpClient.post<AuthResponseData>(this.signUpEndPoint,
            {
                email : signupData.payload.email,
                password : signupData.payload.password,
                returnSecureToken : true
            }).pipe(tap(respData => {
                this.authService.setLogoutTimer(+respData.expiresIn * 1000)
            }),
            map(respData => {
                return handleAuthentication(respData);
            }), catchError( errorResponse =>{
                return handleError(errorResponse);
            }))
        })
    );
    
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData : AuthActions.LoginStart) => {
            return this.httpClient.post<AuthResponseData>(this.signInEndPoint,{
                email : authData.payload.email,
                password : authData.payload.password,
                returnSecureToken : true
            }).pipe(tap(respData => {
                this.authService.setLogoutTimer(+respData.expiresIn * 1000)
            }),map(respData => {
                return handleAuthentication(respData);
            }), catchError( errorResponse =>{
                return handleError(errorResponse);
            }));
        })
    );
    
    @Effect({dispatch : false})
    authSuccess = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap( (authSuccess : AuthActions.AuthenticateSuccess) => {
            if(authSuccess.payload.redirect){
                this.router.navigate(['/']);
            }
        })
    );

    @Effect({dispatch : false})
    logout = this.actions$.pipe(ofType(AuthActions.LOGOUT),
        tap( () => {
            this.router.navigate(['/auth']);
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
        })
    );
    
    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() =>{
            const localUserData: {
                email:string,
                id:string,
                _token:string,
                _tokenExpirationDate:string
            }  = JSON.parse(localStorage.getItem('userData'));
            if(!localUserData){
                return { type : 'DUMMY'};
            }
            const userData = new User(localUserData.email,localUserData.id,localUserData._token,
                new Date(localUserData._tokenExpirationDate));
            if(userData.token){
                const expirationTime = new Date(localUserData._tokenExpirationDate).getTime() - new Date().getTime()
                this.authService.setLogoutTimer(expirationTime);
                return new AuthActions.AuthenticateSuccess({
                  email : userData.email, userId: userData.id, 
                  token : localUserData._token, expirationDate : new Date(localUserData._tokenExpirationDate)
                , redirect:false}
                );
            }
            return { type : 'DUMMY'};
        })
    );

}