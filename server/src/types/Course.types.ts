import type { z } from 'zod';
import type CourseValidator from '../validators/Course.validator';

export type CreateUserTestResult = z.infer<
    typeof CourseValidator.createUserTestResultsSchema.shape.body
>;

export type UpdateTestResults = z.infer<
    typeof CourseValidator.updateTestResultsSchema.shape.body
>;

export interface TestResultsById {
    testName: string;
    result: number;
    createdAt: Date;
    grader: { id: string; firstName: string; lastName: string };
}
