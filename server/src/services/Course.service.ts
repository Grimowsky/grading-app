import { Service } from 'typedi';
import prismaClient from '../prismaClient';
import { type Course } from '../prisma/client';

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
}
