import { BaseCRUDService } from "../common/BaseCRUDService";
import { Like } from "../models/Like";

export class LikeService extends BaseCRUDService<Like> {
    constructor () {
        super(Like);
    }

    async getAllByUserId(
        id: number
    ): Promise<Array<Like> | null> {
        return this.repository.findBy({user_id: id});
    }

    async getAllByRecipeId(
        id: number
    ): Promise<Array<Like> | null> {
        return this.repository.findBy({recipe_id: id});
    }

    async isUserLikedRecipe(
        userId: number,
        recipeId: number
    ): Promise<Object> {
        const entity = await this.repository.findOneBy(
            {recipe_id: recipeId, user_id: userId}
        )
        if (entity) {
            return {"is": true};
        }
        return {"is": false};
    }
}