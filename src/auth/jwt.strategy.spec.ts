import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

const mockUserRepository = () => ({
    findOne: jest.fn()
});

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let userRespository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                { provide: UserRepository, useFactory: mockUserRepository }
            ]
        }).compile();

        jwtStrategy = await module.get(JwtStrategy);
        userRespository = await module.get(UserRepository);
    });

    describe('validate', () => {
        it('validate and retuns  the user based on JWT payload', async () => {
            const user = new User();
            user.username = 'TestUser';

            userRespository.findOne.mockResolvedValue({ username: user.username });
            const result = await jwtStrategy.validate({ username: 'TestUser' });
            expect(userRespository.findOne).toHaveBeenCalledWith({ username: 'TestUser' });
            expect(result).toEqual(user)
        });

        it('throws an unauthorized exception as user cannot be found', async () => {
            userRespository.findOne.mockResolvedValue(null);
            await expect(jwtStrategy.validate({ username: 'TestUser' })).rejects.toThrow(UnauthorizedException);
        });
    });

});