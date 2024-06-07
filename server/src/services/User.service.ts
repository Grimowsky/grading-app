import prismaClient from '../prismaClient';
import { type User } from '../prisma/client';
import { Service } from 'typedi';

@Service()
export class UserService {
    private readonly db = prismaClient;

    getUserList = async (): Promise<User[]> => {
        return this.db.user.findMany();
    };
}
