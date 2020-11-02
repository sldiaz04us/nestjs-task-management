import { ConflictException, InternalServerErrorException } from "@nestjs/common";

import { EntityRepository, Repository } from "typeorm";

import * as bcrypt from 'bcrypt';

import { User } from "./user.entity";
import { AuthCredentialDto } from './dto/auth-credential.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    async signup(authCredentialDto: AuthCredentialDto): Promise<void> {
        const { username, password } = authCredentialDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        console.log(user.password);

        try {
            await user.save();
        } catch (error) {
            console.log(error.code);
            if (error.code === '23505') { // duplicate username
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialDto: AuthCredentialDto): Promise<string> {
        const { username, password } = authCredentialDto;
        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}