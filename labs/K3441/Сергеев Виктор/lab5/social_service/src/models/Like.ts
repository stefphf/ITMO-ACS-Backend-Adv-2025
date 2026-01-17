import { Entity, PrimaryGeneratedColumn, Unique, Column } from "typeorm";

@Entity()
@Unique(["recipe_id", "user_id"])
export class Like {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "integer" })
    recipe_id: number

    @Column({ type: "integer" })
    user_id: number
}
