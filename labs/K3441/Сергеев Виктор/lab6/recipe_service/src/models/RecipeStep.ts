import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Recipe } from "./Recipe";

@Entity()
export class RecipeStep {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "integer"})
    step_number: number

    @Column({type: "varchar", length: 300})
    instruction: string

    @ManyToOne(() => Recipe, (recipe) => recipe.steps, {
        eager: true,
        nullable: false
    })
    @JoinColumn({name: "recipe_id"})
    recipe: Recipe
}