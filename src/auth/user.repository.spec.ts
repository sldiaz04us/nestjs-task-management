import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import * as bcrypt from 'bcrypt';

import { UserRepository } from './user.repository';
import { User } from './user.entity';

const mockCredentialDto = { username: 'TestUsername', password: 'TestPassword' };

describe('UserRepository', () => {
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserRepository]
        }).compile();

        userRepository = await module.get(UserRepository);
    });

    describe('signup', () => {
        let save;
        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        });

        it('successfully signs up the user', async () => {
            save.mockResolvedValue(undefined);
            await expect(userRepository.signup(mockCredentialDto)).resolves.not.toThrow();
        });

        it('throws a conflict exception as username already exists', async () => {
            save.mockRejectedValue({ code: '23505' });
            await expect(userRepository.signup(mockCredentialDto)).rejects.toThrow(ConflictException);

            save.mockRejectedValue({ code: '' });
            await expect(userRepository.signup(mockCredentialDto)).rejects.toThrow(InternalServerErrorException);
        });

        it('throws a internal server exception', async () => {
            save.mockRejectedValue({ code: '' }); // unhandled error code
            await expect(userRepository.signup(mockCredentialDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('validateUserPassword', () => {
        let user;
        beforeEach(() => {
            userRepository.findOne = jest.fn();

            user = new User();
            user.username = 'TestUsername';
            user.validatePassword = jest.fn();

        });
        it('returns the username as validation is succesful', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);

            const result = await userRepository.validateUserPassword(mockCredentialDto);
            expect(result).toEqual('TestUsername');
        });

        it('returns null as user cannot be found', async () => {
            userRepository.findOne.mockResolvedValue(null);

            const result = await userRepository.validateUserPassword(mockCredentialDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('returns null as password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);

            const result = await userRepository.validateUserPassword(mockCredentialDto);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('hashPassword', () => {
        it('calls bcrypt.has to generate a hash', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('testHash');
            expect(bcrypt.hash).not.toHaveBeenCalled();

            const result = await userRepository.hashPassword('testPassword', 'testSalt');
            expect(bcrypt.hash).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
            expect(result).toEqual('testHash');
        });
    });
});