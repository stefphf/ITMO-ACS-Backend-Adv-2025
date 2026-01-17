import { BaseCRUDService } from "../common/BaseCRUDService";
import { RecipeTag } from "../models/RecipeTag";

export class RecipeTagService extends BaseCRUDService<RecipeTag> {
    constructor () {
        super(RecipeTag);
    }

    async getAllByRecipeId(
        id: number
    ): Promise<Array<RecipeTag> | null> {
        return this.repository.findBy({recipe: {id: id}});
    }

    async getAllByTagId(
        id: number
    ): Promise<Array<RecipeTag> | null> {
        return this.repository.findBy({tag: {id: id}});
    }

    async isRecipeHasTag(
        tagId: number,
        recipeId: number
    ): Promise<Object> {
        const entity = await this.repository.findBy(
            {tag: {id: tagId}, recipe: {id: recipeId}}
        );
        if (entity) {
            return {"is": true};
        }
        return {"is": false};
    }
}