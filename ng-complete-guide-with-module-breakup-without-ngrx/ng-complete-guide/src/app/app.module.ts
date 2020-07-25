import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { LoggingService } from './logging.service';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    // Removing Recipes Module as its added in routing module for lazy loading
    //RecipesModule,
    // Removing Recipes Module as its added in routing module for lazy loading
    //ShoppingListModule,
    // Removing Recipes Module as its added in routing module for lazy loading
    // AuthModule,
    SharedModule,
    CoreModule
  ],
  // providers: [ShoppingListService, RecipeService,{
  //   provide : HTTP_INTERCEPTORS , useClass: AuthInterceptorService, multi : true
  // }],
  bootstrap: [AppComponent],
  //providers: [LoggingService] //- now add in eagerly loaded module - CoreModule
  // We dont need entry component to create component from code if angular version is +9
  //entryComponents : [AlertComponent]
})
export class AppModule { }
