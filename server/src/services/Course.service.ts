import { Service } from 'typedi';
import prismaClient from '../prismaClient';
import { type Course, type Test } from '../prisma/client';
import { ExtendedError } from '../utils/error/error';
import { StatusCodes } from 'http-status-codes';
import { type TestToCreate } from '@controllers/Course.controller';

@Service()
export class CourseService {
    private readonly db;
    constructor() {
        this.db = prismaClient;
    }

    private readonly checkForCourseExistence = async (
        id: string
    ): Promise<Course> => {
        const existingCourse = await this.db.course.findFirst({
            where: { id },
        });

        if (!existingCourse) {
            throw new ExtendedError(
                `No course with given id ${id} found`,
                StatusCodes.NOT_FOUND
            );
        }

        return existingCourse;
    };

    createCourse = async (course: Course): Promise<Course> => {
        return this.db.course.create({ data: course });
    };

    getCourses = async (): Promise<Course[]> => {
        return this.db.course.findMany();
    };

    getCourseById = async (id: string): Promise<Course> => {
        return await this.checkForCourseExistence(id);
    };

    updateCourseById = async (id: string, course: Course): Promise<Course> => {
        await this.checkForCourseExistence(id);

        return this.db.course.update({
            data: course,
            where: { id },
        });
    };

    deleteCourseById = async (id: string): Promise<void> => {
        await this.checkForCourseExistence(id);

        await prismaClient.$transaction([
            prismaClient.courseEnrollment.deleteMany({
                where: {
                    courseId: id,
                },
            }),
            prismaClient.course.delete({
                where: {
                    id,
                },
            }),
        ]);
    };

    createCourseTest = async (
        courseId: string,
        testBody: TestToCreate
    ): Promise<Test> => {
        await this.checkForCourseExistence(courseId);

        return prismaClient.test.create({ data: { ...testBody, courseId } });
    };
}
