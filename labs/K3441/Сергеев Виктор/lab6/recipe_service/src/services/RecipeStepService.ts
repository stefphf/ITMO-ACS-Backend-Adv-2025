import { RecipeStep } from "../models/RecipeStep";
import { BaseCRUDService } from "../common/BaseCRUDService";

export class RecipeStepService extends BaseCRUDService<RecipeStep> {
    constructor() {
        super(RecipeStep);
    }

    async getAllByRecipeId (
        recipeId: number
    ): Promise<Array<RecipeStep> | null> {
        return this.repository.findBy({recipe: {id: recipeId}});
    }
}