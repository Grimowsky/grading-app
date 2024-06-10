import { Router } from 'express';
import { Container } from 'typedi';
import { CourseController } from '@controllers/Course.controller';
import { asyncWrapper } from '../../../../middleware/asyncWrapper';
import CourseValidator from '../../../../validators/Course.validator';
import validateRequest from '../../../../middleware/validateRequest';

const CourseRoutes = (): Router => {
    const router = Router();
    const courseController = Container.get(CourseController);

    router.post(
        '/',
        asyncWrapper(validateRequest(CourseValidator.courseSchema)),
        asyncWrapper(courseController.createCourse)
    );

    router.get('/', asyncWrapper(courseController.getCourses));

    return router;
};

export default CourseRoutes;
