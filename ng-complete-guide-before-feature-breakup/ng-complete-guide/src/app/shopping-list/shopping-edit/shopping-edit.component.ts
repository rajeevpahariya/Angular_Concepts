import { Component, OnInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('nameInput', {static : false}) nameInputRef : ElementRef;
  @ViewChild('amountInput', {static : false}) amountInputRef : ElementRef;
  //@Output() ingredientAdded = new EventEmitter<Ingredient>();
  constructor(private shoppingListService: ShoppingListService) { }
  @ViewChild('f',{static:false}) slForm : NgForm;
  subscription : Subscription;
  editMode : boolean = false;
  editedItemIndex : number;
  editedItem: Ingredient;

  ngOnInit() {
    this.subscription = this.shoppingListService.startEditing.subscribe(
      (index : number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.slForm.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  // Below method was implemeted when form was submitted with ngForm
  onAddItem(){
    const newIngredient = new Ingredient(this.nameInputRef.nativeElement.value,
      this.amountInputRef.nativeElement.value);
    this.shoppingListService.addIngredient(newIngredient);
    // dont need below line as using the cross component communication.
    //this.ingredientAdded.emit(newIngredient);
  }

  onSubmit(form : NgForm){
    const newIngredient = new Ingredient(form.value.name,
      form.value.amount);
    if(this.editMode){
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    }else{
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode=false;
    form.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
