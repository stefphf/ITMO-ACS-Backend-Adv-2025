import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { RecipeStep } from "./RecipeStep";
import { RecipeIngredient } from "./RecipeIngredient";
import { RecipeTag } from "./RecipeTag";

@Entity()
export class Recipe {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", length: 100})
    title: string

    @Column({type: "varchar", length: 800})
    description: string

    @Column({type: "integer"})
    cooking_time: number

    @Column({type: "integer"})
    difficulty: number

    @Column({type: "varchar", length: 100})
    image_url: string

    @Column({type: "varchar", length: 100, nullable: true})
    video_url: string | null

    @Column({type: "timestamp", update: false, default: () => "CURRENT_TIMESTAMP"})
    created_at: Date

    @Column({type: "integer"})
    author_id: number;

    @OneToMany(() => RecipeStep, (step) => step.recipe)
    steps: Array<RecipeStep>

    @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe)
    recipe_ingredients: Array<RecipeIngredient>

    @OneToMany(() => RecipeTag, (tag) => tag.recipe)
    recipe_tags: Array<RecipeTag>
}