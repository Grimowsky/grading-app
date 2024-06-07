import prismaClient from '../prismaClient';
import { type User, type CourseEnrollment } from '../prisma/client';
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

    deleteUser = async (id: string): Promise<void> => {
        const existingUser = await prismaClient.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            throw new ExtendedError(
                'User with given id does not exist',
                StatusCodes.BAD_REQUEST
            );
        }

        // delete user and related data in a transaction
        await prismaClient.$transaction([
            prismaClient.testResult.deleteMany({ where: { userId: id } }),
            prismaClient.testResult.deleteMany({ where: { graderId: id } }),
            prismaClient.courseEnrollment.deleteMany({ where: { userId: id } }),
            prismaClient.user.delete({ where: { id } }),
        ]);
    };

    updateUser = async (id: string, user: Partial<User>): Promise<User> => {
        const existingUser = await prismaClient.user.findUnique({
            where: {
                id,
            },
        });

        if (!existingUser) {
            throw new ExtendedError(
                'User with given id does not exist',
                StatusCodes.BAD_REQUEST
            );
        }

        return prismaClient.user.update({
            data: { ...user, social: user?.social ?? {} },
            where: {
                id,
            },
        });
    };

    getUserCourseEnrollments = async (
        id: string
    ): Promise<CourseEnrollment[]> => {
        return prismaClient.courseEnrollment.findMany({
            where: { userId: id },
            include: {
                course: true,
            },
        });
    };
}
