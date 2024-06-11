import { Service } from 'typedi';
import prismaClient from '../prismaClient';
import { type Course, type Test, type TestResult } from '../prisma/client';
import { ExtendedError } from '../utils/error/error';
import { StatusCodes } from 'http-status-codes';
import { type TestToCreate } from '@controllers/Course.controller';
import {
    type CreateUserTestResult,
    type UpdateTestResults,
} from '../types/Course.types';
import * as test from 'node:test';

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

    getTestById = async (testId: string): Promise<Test> => {
        const existingTest = await prismaClient.test.findFirst({
            where: { id: testId },
        });

        if (!existingTest) {
            throw new ExtendedError(
                `Test with given id ${testId} was not found`,
                StatusCodes.NOT_FOUND
            );
        }

        return existingTest;
    };

    updateTestById = async (
        testId: string,
        test: TestToCreate
    ): Promise<Test> => {
        const existingTest = await prismaClient.test.findFirst({
            where: { id: testId },
        });

        if (!existingTest) {
            throw new ExtendedError(
                `Test with given id ${testId} was not found`,
                StatusCodes.NOT_FOUND
            );
        }

        return prismaClient.test.update({ data: test, where: { id: testId } });
    };

    deleteTestById = async (testId: string): Promise<void> => {
        const existingTest = await prismaClient.test.findFirst({
            where: { id: testId },
        });

        if (!existingTest) {
            throw new ExtendedError(
                `Test with given id ${testId} was not found`,
                StatusCodes.NOT_FOUND
            );
        }

        await prismaClient.$transaction([
            prismaClient.testResult.deleteMany({ where: { testId } }),
            prismaClient.test.deleteMany({ where: { id: testId } }),
        ]);
    };

    createUserTestResult = async (
        testId: string,
        results: CreateUserTestResult
    ): Promise<CreateUserTestResult> => {
        const cratedResult = await prismaClient.testResult.create({
            data: {
                testId,
                graderId: results.graderId,
                studentId: results.studentId,
                result: results.result,
            },
        });

        return {
            graderId: cratedResult.graderId,
            studentId: cratedResult.studentId,
            result: cratedResult.result,
        };
    };

    getTestsResultsById = async (testId: string): Promise<TestResult[]> => {
        const existingTest = await prismaClient.test.findFirst({
            where: { id: testId },
        });

        if (!existingTest) {
            throw new ExtendedError(
                `Test with given id ${testId} was not found`,
                StatusCodes.NOT_FOUND
            );
        }

        const results = await prismaClient.testResult.findMany({
            where: { testId },
        });

        return results;
    };

    updateTestResults = async (
        testResultsId: string,
        results: UpdateTestResults
    ): Promise<UpdateTestResults> => {
        const existingTest = await prismaClient.testResult.findFirst({
            where: { id: testResultsId },
        });

        if (!existingTest) {
            throw new ExtendedError(
                `Test with given id ${testResultsId} was not found`,
                StatusCodes.NOT_FOUND
            );
        }

        const updatedTest = await prismaClient.testResult.update({
            where: { id: testResultsId },
            data: {
                ...results,
            },
        });

        return {
            graderId: updatedTest.graderId,
            result: updatedTest.result,
            studentId: updatedTest.studentId,
        };
    };
}
