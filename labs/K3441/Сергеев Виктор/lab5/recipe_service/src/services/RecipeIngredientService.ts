import { BaseCRUDService } from "../common/BaseCRUDService";
import { RecipeIngredient } from "../models/RecipeIngredient";

export class RecipeIngredientService
    extends BaseCRUDService<RecipeIngredient> {
    constructor() {
        super(RecipeIngredient);
    }

    async getAllByRecipeId(
        id: number
    ): Promise<Array<RecipeIngredient> | null> {
        return this.repository.findBy({recipe: {id: id}});
    }

    async getAllByIngredientId(
        id: number
    ): Promise<Array<RecipeIngredient> | null> {
        return this.repository.findBy({ingredient: {id: id}});
    }

    async isIngredientInRecipe(
        ingredientId: number,
        recipeId: number
    ): Promise<Object> {
        const entity = await this.repository.findBy(
            {ingredient: {id: ingredientId}, recipe: {id: recipeId}}
        );
        if (entity) {
            return {"is": true};
        }
        return {"is": false};
    }
}