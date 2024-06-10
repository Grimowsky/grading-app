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

const CourseValidator = {
    courseSchema,
    courseIdSchema,
    updateCourseSchema,
};

export default CourseValidator;
