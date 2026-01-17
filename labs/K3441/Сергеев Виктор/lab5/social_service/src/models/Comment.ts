import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "integer" })
    user_id: number

    @Column({ type: "integer" })
    recipe_id: number

    @Column({type: "varchar", length: 200})
    comment: string

    @Column({type: "timestamp", update: false, default: () => "CURRENT_TIMESTAMP"})
    created_at: Date
}