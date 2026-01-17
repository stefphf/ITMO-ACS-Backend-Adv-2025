import { Recipe } from "../models/Recipe";
import { BaseCRUDService } from "../common/BaseCRUDService";

export class RecipeService extends BaseCRUDService<Recipe> {
    constructor () {
        super(Recipe);
    }

    async getAllByAuthorId (
        authorId: number
    ): Promise<Array<Recipe> | null> {
        return this.repository.findBy({author_id: authorId});
    }

    async getFilteredByTagAndTitle (
        titleFilter: string,
        tagId: number
    ): Promise<Array<Recipe> | null> {
        const data = this.repository
            .createQueryBuilder("recipe")
            .innerJoin("recipe.recipe_tags", "recipeTag")
            .innerJoin("recipeTag.tag", "tag")
            .where("tag.id = :tagId", { tagId })
            .andWhere("recipe.title ILIKE :title", { title: `%${titleFilter}%` })
            .getMany();
        
        return data;
    }

    async getFilteredByTitle (
        titleFilter: string,
    ): Promise<Array<Recipe> | null> {
        const data = this.repository
            .createQueryBuilder("recipe")
            .where("recipe.title ILIKE :title", { title: `%${titleFilter}%` })
            .getMany();
        
        return data;
    }

    async getFilteredByTag (
        tagId: number
    ): Promise<Array<Recipe> | null> {
        const data = this.repository
            .createQueryBuilder("recipe")
            .innerJoin("recipe.recipe_tags", "recipeTag")
            .innerJoin("recipeTag.tag", "tag")
            .where("tag.id = :tagId", { tagId })
            .getMany();
        
        return data;
    }   
}