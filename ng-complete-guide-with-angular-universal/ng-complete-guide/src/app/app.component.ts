import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { LoggingService } from './logging.service';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer'
import * as AuthActions from './auth/store/auth.actions'
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  loadedFeature = 'recipe';
  constructor(private store:Store<fromApp.AppState>, private loggingService : LoggingService,
    @Inject(PLATFORM_ID) private platformId){}
  onNavigate(feature:string){
    this.loadedFeature = feature;
  }

  ngOnInit(){
    if(isPlatformBrowser){
      // added Angular universal check becuase this action will call browser "localStorage" API
      this.store.dispatch(new AuthActions.AutoLogin());
    }
    this.loggingService.printLog("Hello from App Component ngOnIt");
  }

}
