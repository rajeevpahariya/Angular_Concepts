import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  // providers: [ShoppingListService] - Will be used in Recipe, hence adding in app module.
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  ingredientAddedSubject:Subscription;

  constructor(private shoppingListService: ShoppingListService, private loggingService : LoggingService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientAddedSubject = this.shoppingListService.ingredientChanged.subscribe(
      (ingredients:Ingredient[])=>{
        this.ingredients = ingredients;
      }
    );
    this.loggingService.printLog("Hello from Shopping-List Component ngOnIt");
  }
  // onIngredientAdded(newIngredient : Ingredient){
  //   this.ingredients.push(newIngredient);
  // }

  onEditItem(index : number){
    this.shoppingListService.startEditing.next(index);
  }

  ngOnDestroy(){
    // Its good to unsubscribe the Subject
    this.ingredientAddedSubject.unsubscribe();
  }

}
