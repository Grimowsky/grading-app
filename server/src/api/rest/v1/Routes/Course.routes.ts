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
    router.get(
        '/:id',
        asyncWrapper(validateRequest(CourseValidator.courseIdSchema)),
        asyncWrapper(courseController.getCourseById)
    );
    router.put(
        '/:id',
        asyncWrapper(validateRequest(CourseValidator.updateCourseSchema)),
        asyncWrapper(courseController.updateCourseById)
    );
    router.delete(
        '/:id',
        asyncWrapper(validateRequest(CourseValidator.courseIdSchema)),
        asyncWrapper(courseController.deleteCourseById)
    );
    router.post(
        '/:id/tests',
        asyncWrapper(validateRequest(CourseValidator.createTestSchema)),
        asyncWrapper(courseController.createTest)
    );
    router.get(
        '/tests/:testId',
        asyncWrapper(validateRequest(CourseValidator.getCourseSchema)),
        asyncWrapper(courseController.getTestById)
    );
    router.put(
        '/tests/:testId',
        asyncWrapper(validateRequest(CourseValidator.updateTestSchema)),
        asyncWrapper(courseController.updateTestById)
    );
    router.delete(
        '/tests/:testId',
        asyncWrapper(validateRequest(CourseValidator.deleteTestSchema)),
        asyncWrapper(courseController.deleteTestById)
    );
    router.post(
        '/tests/:testId/test-results',
        asyncWrapper(
            validateRequest(CourseValidator.createUserTestResultsSchema)
        ),
        asyncWrapper(courseController.createUserTestResult)
    );
    router.get(
        '/tests/:testId/test-results',
        asyncWrapper(validateRequest(CourseValidator.getTestResultsByIdSchema)),
        asyncWrapper(courseController.getTestResultsById)
    );

    return router;
};

export default CourseRoutes;
