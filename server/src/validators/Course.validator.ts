import { z } from 'zod';

const courseSchema = z.object({
    body: z.object({
        name: z.string(),
        courseDetails: z.string(),
    }),
});

const courseIdSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
});

const updateCourseSchema = z.object({
    body: z.object({
        name: z.string(),
        courseDetails: z.string(),
    }),
    params: z.object({
        id: z.string(),
    }),
});

const createTestSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        name: z.string(),
    }),
});

const getCourseSchema = z.object({
    params: z.object({
        testId: z.string(),
    }),
});

const updateTestSchema = z.object({
    params: z.object({
        testId: z.string(),
    }),
    body: z.object({
        name: z.string(),
    }),
});

const deleteTestSchema = z.object({
    params: z.object({
        testId: z.string(),
    }),
});

const createUserTestResultsSchema = z.object({
    params: z.object({
        testId: z.string(),
    }),
    body: z.object({
        result: z.number().positive(),
        graderId: z.string(),
        studentId: z.string(),
    }),
});

const getTestResultsByIdSchema = z.object({
    params: z.object({
        testId: z.string(),
    }),
});

const updateTestResultsSchema = z.object({
    params: z.object({
        testResultId: z.string(),
    }),
    body: z.object({
        result: z.number().positive(),
        graderId: z.string(),
        studentId: z.string(),
    }),
});

const deleteTestResultsSchema = z.object({
    params: z.object({
        testResultId: z.string(),
    }),
});

const CourseValidator = {
    courseSchema,
    courseIdSchema,
    updateCourseSchema,
    createTestSchema,
    getCourseSchema,
    updateTestSchema,
    deleteTestSchema,
    createUserTestResultsSchema,
    getTestResultsByIdSchema,
    updateTestResultsSchema,
    deleteTestResultsSchema,
};

export default CourseValidator;
