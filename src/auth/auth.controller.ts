import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signup(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto) {
        return this.authService.signup(authCredentialDto);
    }
}
