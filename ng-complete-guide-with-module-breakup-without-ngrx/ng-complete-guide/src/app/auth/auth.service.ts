import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

export interface AuthResponseData{
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered? : boolean 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // API Key, pleae check in Firebase setting for your account
  signUpEndPoint:string = 
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="+environment.firebaseAPIKey;
  signInEndPoint:string = 
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+environment.firebaseAPIKey;
  
  //user = new Subject<User>();
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(private httpClient : HttpClient, private router : Router) { }

  signUp(email: string, password: string){
    return this.httpClient.post<AuthResponseData>(this.signUpEndPoint,
      {
        email : email,
        password : password,
        returnSecureToken : true
      }).pipe(catchError(this.handleError), tap( respData => {
        this.handleAuthentication(respData.email, respData.localId,
           respData.idToken, +respData.expiresIn)
      }));
  }

  signIn(email: string, password: string){
    return this.httpClient.post<AuthResponseData>(this.signInEndPoint,
      {
        email : email,
        password : password,
        returnSecureToken : true
      }).pipe(catchError(this.handleError), tap( respData => {
        this.handleAuthentication(respData.email, respData.localId,
          respData.idToken, +respData.expiresIn)
      }));
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer=null;
  }

  private handleAuthentication(email:string, userId:string, token : string, expiresIn : number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn*1000);
    // Storing data in browser local storage.
    localStorage.setItem('userData',JSON.stringify(user));
  }

  autoLogin(){
    const localUserData: {
      email:string,
      id:string,
      _token:string,
      _tokenExpirationDate:string
    }  = JSON.parse(localStorage.getItem('userData'));
    if(!localUserData){
      return;
    }
    const userData = new User(localUserData.email,localUserData.id,localUserData._token,
      new Date(localUserData._tokenExpirationDate));
    if(userData.token){
      this.user.next(userData);
      const expirationTime = new Date(localUserData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(expirationTime);
    }
  }

  autoLogout(expirationTime : number){
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logout();
    },expirationTime);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    console.log(errorResponse);
    let errorMessage = "Unknown error occured!";
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  }

}
