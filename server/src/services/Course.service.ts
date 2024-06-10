import { Service } from 'typedi';
import prismaClient from '../prismaClient';
import { type Course } from '../prisma/client';
import { ExtendedError } from '../utils/error/error';
import { StatusCodes } from 'http-status-codes';

@Service()
export class CourseService {
    private readonly db;
    constructor() {
        this.db = prismaClient;
    }

    createCourse = async (course: Course): Promise<Course> => {
        return this.db.course.create({ data: course });
    };

    getCourses = async (): Promise<Course[]> => {
        return this.db.course.findMany();
    };

    getCourseById = async (id: string): Promise<Course> => {
        const course = await this.db.course.findFirst({
            where: {
                id,
            },
        });

        if (!course) {
            throw new ExtendedError(
                `No course with given id ${id} found`,
                StatusCodes.NOT_FOUND
            );
        }

        return course;
    };

    updateCourseById = async (id: string, course: Course): Promise<Course> => {
        const existingCourse = await this.db.course.findFirst({
            where: { id },
        });

        if (!existingCourse) {
            throw new ExtendedError(
                `No course with given id ${id} found`,
                StatusCodes.NOT_FOUND
            );
        }

        return this.db.course.update({
            data: course,
            where: { id },
        });
    };
}
