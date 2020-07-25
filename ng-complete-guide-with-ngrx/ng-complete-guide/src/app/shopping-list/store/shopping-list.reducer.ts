import { Ingredient } from '../../shared/ingredient.model'
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
    ingredients :  Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number
}

const initialState = {
    ingredients : [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),],
    editedIngredient: null,
    editedIngredientIndex : -1
}

export function shoppingListReducer(state = initialState, 
    action : ShoppingListActions.ShoppingListActions) {
    switch(action.type){
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients : [...state.ingredients, action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return{
                ...state,
                ingredients : [...state.ingredients, ...action.payload] // ...Spread operator for arrays
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            // Getting the old ingredient 1st
            const ingredient = state.ingredients[state.editedIngredientIndex];
            // Updatign ingredient by 1st use old and then replace with coming in payload.
            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            }
            // Copying old state ingredients array
            const updatedIngredients = [...state.ingredients];
            // Updating the copeid array index with new data
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
            return {
                ...state,
                ingredients : updatedIngredients,
                editedIngredient: null,
                editedIngredientIndex : -1
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients : state.ingredients.filter((ig, index) => {
                    return index != state.editedIngredientIndex;
                }),
                editedIngredient: null,
                editedIngredientIndex : -1
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex : action.payload,
                editedIngredient : {...state.ingredients[action.payload]}
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredientIndex : -1,
                editedIngredient : null
            };
        default: 
            return state;
    }
}