import { z } from 'zod';

const courseSchema = z.object({
    body: z.object({
        name: z.string(),
        courseDetails: z.string(),
    }),
});

const CourseValidator = {
    courseSchema,
};

export default CourseValidator;
