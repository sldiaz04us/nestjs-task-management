import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['username']) // defining uniqueness on username column
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    // @Column({ unique: true }) // another way of define uniqueness
    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;
}