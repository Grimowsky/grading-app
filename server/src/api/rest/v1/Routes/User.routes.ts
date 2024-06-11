import { Router, type Router as RouterReturn } from 'express';
import { UserController } from '@controllers/User.controller';
import { Container } from 'typedi';
import RequestValidator from '../../../../middleware/validateRequest';
import UserValidators from '../../../../validators/User.validator';
import { asyncWrapper } from '../../../../middleware/asyncWrapper';

const UserRoutes = (): RouterReturn => {
    const router = Router();
    const userController = Container.get(UserController);

    router.get('/', asyncWrapper(userController.getUsersList));
    router.get('/:id', asyncWrapper(userController.getUserById));
    router.post(
        '/',
        asyncWrapper(RequestValidator(UserValidators.createUserValidator)),
        asyncWrapper(userController.addUser)
    );
    router.delete('/:id', asyncWrapper(userController.deleteUser));
    router.put(
        '/:id',
        asyncWrapper(RequestValidator(UserValidators.updateUserValidator)),
        asyncWrapper(userController.updateUser)
    );
    router.get('/:id/courses', asyncWrapper(userController.courseEnrollments));
    router.post(
        '/:id/courses/:courseId',
        asyncWrapper(RequestValidator(UserValidators.enrollmentValidator)),
        asyncWrapper(userController.enrollUserToCourse)
    );
    router.delete(
        '/:id/courses/:courseId',
        asyncWrapper(userController.deleteUserEnrollment)
    );
    router.get(
        '/:userId/test-results',
        asyncWrapper(
            RequestValidator(UserValidators.getUsersTestsResultsValidator)
        ),
        asyncWrapper(userController.getUserResults)
    );

    return router;
};

export default UserRoutes;
