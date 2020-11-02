import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) { }

    async signup(authCredentialDto: AuthCredentialDto) {
        return this.userRepository.signup(authCredentialDto);
    }

    async signin(authCredentialDto: AuthCredentialDto) {
        const username = await this.userRepository.validateUserPassword(authCredentialDto);
        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
