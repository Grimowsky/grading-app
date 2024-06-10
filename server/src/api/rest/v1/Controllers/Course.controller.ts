import { Service } from 'typedi';
import { CourseService } from '@services/Course.service';
import {
    type AppReq,
    type AppRes,
} from '../../../../common/types/Request.type';
import { StatusCodes } from 'http-status-codes';
import { type Course } from '../../../../prisma/client';

@Service()
export class CourseController {
    private readonly courseService: CourseService;
    constructor(courseService: CourseService) {
        this.courseService = courseService;
    }

    createCourse = async (req: AppReq, res: AppRes): Promise<void> => {
        const course = req.body as Course;

        const insertedCourse: Course = await this.courseService.createCourse(
            course
        );
        res.status(StatusCodes.CREATED).send({ ...insertedCourse });
    };

    getCourses = async (_req: AppReq, res: AppRes): Promise<void> => {
        const courses = await this.courseService.getCourses();

        res.status(StatusCodes.OK).send({ data: courses });
    };

    getCourseById = async (req: AppReq, res: AppRes): Promise<void> => {
        const id = req.params.id;

        const course = await this.courseService.getCourseById(id);

        res.status(StatusCodes.OK).send({ course });
    };
}
