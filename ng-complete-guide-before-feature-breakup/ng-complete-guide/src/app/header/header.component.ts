import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  //@Output() featureSelected = new EventEmitter<string>();
  
  // onSelect(feature : string){
  //   this.featureSelected.emit(feature);
  // }

  private userSub : Subscription;
  isAuthenticated:boolean = false;
  constructor(private dataService : DataStorageService, 
    private authService : AuthService,
    private router : Router){}
  onSaveData(){
    this.dataService.storeRecipe();
  }
  onFetchData(){
    this.dataService.fetchRecipe().subscribe();
  }
  onLogout(){
    this.authService.logout();
  }
  ngOnInit(){
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user; // !user ? false : true
      console.log(!!user);
    });
  }
  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}
