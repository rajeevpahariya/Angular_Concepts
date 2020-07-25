import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators'
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {
    apiEndPoint = 'https://ng-course-recipe-book-24890.firebaseio.com/recipes.json';

    constructor(private http: HttpClient, private recipeService: RecipeService,
        private authService: AuthService) { }

    storeRecipe() {
        const recipes = this.recipeService.getRecipes();
        this.http.put(this.apiEndPoint, recipes).subscribe(
            response => {
                console.log(response);
            }
        );
    }

    fetchRecipe() {
        // Below code is removing after adding Auth Code. Auth has to pass to get the below response
        return this.http.get<Recipe[]>(this.apiEndPoint)
            .pipe(map(recipes => {
                // Below map is java script function not the operators
                return recipes.map(recipes => {
                    return { ...recipes, ingredients: recipes.ingredients ? recipes.ingredients : [] }
                })
            }), tap(recipes => {
                return this.recipeService.setRecipes(recipes);
            }));
    }
}