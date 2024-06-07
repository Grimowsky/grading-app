import prismaClient from '../prismaClient';
import { type User } from '../prisma/client';
import { Service } from 'typedi';
import { ExtendedError } from '../utils/error/error';
import { StatusCodes } from 'http-status-codes';

@Service()
export class UserService {
    private readonly db = prismaClient;

    getUserList = async (): Promise<User[]> => {
        return this.db.user.findMany();
    };

    getUserById = async (id: string): Promise<User> => {
        const user = await this.db.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new ExtendedError(
                `No user found with given ${id}`,
                StatusCodes.NOT_FOUND
            );
        }

        return user;
    };

    addUser = async (user: User): Promise<void> => {
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: user.email,
            },
        });

        if (existingUser) {
            throw new ExtendedError(
                `User with given email already exist`,
                StatusCodes.CONFLICT
            );
        }

        await prismaClient.user.create({
            data: { ...user, social: user.social ?? {} },
        });
    };
}