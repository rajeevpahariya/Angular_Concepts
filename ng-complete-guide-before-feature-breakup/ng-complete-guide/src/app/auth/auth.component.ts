import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{
  isLoginMode = true;
  isLoading = false;
  error:string = null;

  constructor(private authService : AuthService, private router : Router,
    private componentFactoryResolver: ComponentFactoryResolver){}
  
  ngOnDestroy(): void {
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }

  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form : NgForm){
    if(!form.valid){
      return;
    }
    this.isLoading=true;
    let authObservable:Observable<AuthResponseData>;
    if(this.isLoginMode){
      authObservable = this.authService.signIn(form.value.email,form.value.password);
    }else{
      authObservable = this.authService.signUp(form.value.email,form.value.password);
    }
    
    // Added below code as it will be common
    authObservable.subscribe(respData => {
      console.log(respData);
      this.router.navigate(['/recipes']);
      this.isLoading=false;
    }, errorMessage => {
      // Remomveing below logic as its handle in service
      // switch(errorResp.error.error.message){
      //   case 'EMAIL_EXISTS' :
      //     this.error = "This email Id is already exist"
      // }
      this.error = errorMessage;
      this.showErrorAlert(errorMessage);
      this.isLoading=false;
    });
    form.reset();
  }

  onHandleError(){
    this.error=null;
  }

  private showErrorAlert(message: string) {
    // const alertCmp = new AlertComponent();
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
