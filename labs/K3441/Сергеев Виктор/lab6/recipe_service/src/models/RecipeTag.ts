import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, JoinColumn } from "typeorm";
import { Recipe } from "./Recipe";
import { Tag } from "./Tag";

@Entity()
@Unique(["tag", "recipe"])
export class RecipeTag {
    
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Tag, (tag) => tag.recipe_tags, {
        eager: true,
        nullable: false
    })
    @JoinColumn({name: "tag_id"})
    tag: Tag

    @ManyToOne(() => Recipe, (recipe) => recipe.recipe_tags, {
        eager: true,
        nullable: false
    })
    @JoinColumn({name: "recipe_tag"})
    recipe: Recipe
}
