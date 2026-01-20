import { Comment } from "../models/Comment";
import { BaseCRUDService } from "../common/BaseCRUDService";

export class CommentService extends BaseCRUDService<Comment> {
    constructor() {
        super(Comment);
    }

    async getAllByUserId(
        id: number
    ): Promise<Array<Comment> | null> {
        return this.repository.findBy({user_id: id});
    }

    async getAllByRecipeId(
        id: number
    ): Promise<Array<Comment> | null> {
        return this.repository.findBy({recipe_id: id});
    }

    async getAllByIds(
        userId: number,
        recipeId: number
    ): Promise<Array<Comment> | null> {
        return this.repository.findBy({recipe_id: recipeId, user_id: userId});
    }
}