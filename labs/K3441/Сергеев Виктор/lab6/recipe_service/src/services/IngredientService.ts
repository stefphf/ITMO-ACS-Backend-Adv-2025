import { BaseCRUDService } from "../common/BaseCRUDService";
import { Ingredient } from "../models/Ingredient";

export class IngredientService extends BaseCRUDService<Ingredient> {
    constructor() {
        super(Ingredient);
    }

    getEntityByName = async(
        name: string
    ): Promise<Ingredient | null> => {
        return this.repository.findOneBy({name: name});
    }
}