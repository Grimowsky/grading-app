import type { z } from 'zod';
import type CourseValidator from '../validators/Course.validator';

export type CreateUserTestResult = z.infer<
    typeof CourseValidator.createUserTestResultsSchema.shape.body
>;
