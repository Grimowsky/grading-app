import prismaClient from '../prismaClient';
import {
    type User,
    type CourseEnrollment,
    type UserRole,
} from '../prisma/client';
import { Service } from 'typedi';
import { ExtendedError } from '../utils/error/error';
import { StatusCodes } from 'http-status-codes';

interface UserTestResult {
    result: number;
    createdAt: Date;
    courseName: string | null;
    courseId: string;
}

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
            prismaClient.testResult.deleteMany({ where: { studentId: id } }),
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

    enrollUserForCourse = async (
        userId: string,
        courseId: string,
        role: UserRole
    ): Promise<void> => {
        const existingEnrollment =
            await prismaClient.courseEnrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId,
                        courseId,
                    },
                },
            });

        if (existingEnrollment) {
            throw new ExtendedError(
                `User is already enrolled in this course`,
                StatusCodes.CONFLICT
            );
        }

        await prismaClient.courseEnrollment.create({
            data: {
                courseId,
                userId,
                role,
            },
        });
    };

    deleteUserEnrollment = async (
        userId: string,
        courseId: string
    ): Promise<void> => {
        const existingEnrollment =
            await prismaClient.courseEnrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId,
                        courseId,
                    },
                },
            });

        if (!existingEnrollment) {
            throw new ExtendedError(
                `User is not enrolled in this course`,
                StatusCodes.CONFLICT
            );
        }

        await prismaClient.courseEnrollment.delete({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });
    };

    getUserResults = async (studentId: string): Promise<UserTestResult[]> => {
        const results = await prismaClient.testResult.findMany({
            where: { studentId },
            select: {
                result: true,
                createdAt: true,
                test: {
                    select: {
                        courseId: true,
                        Course: {
                            select: {
                                name: true,
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        if (!results) {
            return [];
        }

        return results.map((result) => ({
            result: result.result,
            createdAt: result.createdAt,
            courseName: result.test?.Course?.name || null,
            courseId: result?.test?.Course?.id,
        }));
    };
}
