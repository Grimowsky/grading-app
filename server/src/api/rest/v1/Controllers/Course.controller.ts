import { Service } from 'typedi';
import { CourseService } from '@services/Course.service';
import {
    type AppReq,
    type AppRes,
} from '../../../../common/types/Request.type';
import { StatusCodes } from 'http-status-codes';
import { type Course, type Test } from '../../../../prisma/client';
import {
    type CreateUserTestResult,
    type UpdateTestResults,
} from '../../../../types/Course.types';

export type TestToCreate = Pick<Test, 'name'>;

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

    updateCourseById = async (req: AppReq, res: AppRes): Promise<void> => {
        const id = req.params.id;
        const course = req.body as Course;

        const updatedCourse = await this.courseService.updateCourseById(
            id,
            course
        );

        res.status(StatusCodes.OK).send({ ...updatedCourse });
    };

    deleteCourseById = async (req: AppReq, res: AppRes): Promise<void> => {
        const id = req.params.id;

        await this.courseService.deleteCourseById(id);

        res.status(StatusCodes.OK).send({ ok: true });
    };

    createTest = async (req: AppReq, res: AppRes): Promise<void> => {
        const id = req.params.id;
        const testToCreate = req.body as TestToCreate;

        await this.courseService.createCourseTest(id, testToCreate);

        res.status(StatusCodes.CREATED).send({ ...testToCreate });
    };

    getTestById = async (req: AppReq, res: AppRes): Promise<void> => {
        const testId = req.params.testId;

        const test = await this.courseService.getTestById(testId);

        res.status(StatusCodes.OK).send({ ...test });
    };

    updateTestById = async (req: AppReq, res: AppRes): Promise<void> => {
        const testId = req.params.testId;
        const test = req.body as TestToCreate;

        const updatedTest = await this.courseService.updateTestById(
            testId,
            test
        );

        res.status(StatusCodes.OK).send({ ...updatedTest });
    };

    deleteTestById = async (req: AppReq, res: AppRes): Promise<void> => {
        const testId = req.params.testId;

        await this.courseService.deleteTestById(testId);

        res.status(StatusCodes.OK).send({ ok: true });
    };

    createUserTestResult = async (req: AppReq, res: AppRes): Promise<void> => {
        const testId = req.params.testId;
        const results = req.body as CreateUserTestResult;

        const createdTestResults =
            await this.courseService.createUserTestResult(testId, results);

        res.status(StatusCodes.CREATED).send({ ...createdTestResults });
    };

    getTestResultsById = async (req: AppReq, res: AppRes): Promise<void> => {
        const testId = req.params.testId;

        const results = await this.courseService.getTestsResultsById(testId);

        res.status(StatusCodes.OK).send({ data: results });
    };

    updateTestResultsById = async (req: AppReq, res: AppRes): Promise<void> => {
        const testResultsId = req.params.testResultId;
        const results = req.body as UpdateTestResults;

        const updatedTest = await this.courseService.updateTestResults(
            testResultsId,
            results
        );

        res.status(StatusCodes.OK).send({ ...updatedTest });
    };

    deleteTestResultById = async (req: AppReq, res: AppRes): Promise<void> => {
        const testResultsId = req.params.testResultId;

        await this.courseService.deleteTestResultById(testResultsId);

        res.status(StatusCodes.OK).send({ ok: true });
    };
}
